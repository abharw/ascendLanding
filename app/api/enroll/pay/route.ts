import { NextRequest, NextResponse } from "next/server"
import { SquareClient, SquareEnvironment } from "square"
import { saveEnrollment, updateEnrollment } from "@/lib/enrollments-db"

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN ?? "",
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
})

// ⚠️ TEST PRICES — all programs temporarily set to $1.00 for end-to-end testing.
// Restore real prices before going live:
//   "ascendiq-bootcamp": 149_500
//   "startup-lab":        49_900
//   "skills-internships": 39_900
//   "career-training":    59_900
//   "test-payment":       100
const PROGRAM_PRICES: Record<string, number> = {
  "ascendiq-bootcamp": 100,
  "startup-lab": 100,
  "skills-internships": 100,
  "career-training": 100,
  "test-payment": 100,
}

const PROGRAM_NAMES: Record<string, string> = {
  "ascendiq-bootcamp": "Summer Startup Lab",
  "startup-lab": "Entrepreneurship Training",
  "skills-internships": "Apprenticeship Skill Building",
  "career-training": "Mentoring & Coaching",
  "test-payment": "Test Payment",
}

// "cart" = multi-program individual selection; "flex-bundle" = bundle picker
const OPEN_PROGRAMS = [
  "ascendiq-bootcamp",
  "flex-bundle",
  "test-payment",
  "startup-lab",
  "skills-internships",
  "career-training",
  "cart",
]

function computeAmount(
  programId: string,
  bundleSelections: string[],
  cartItems: string[],
): number | null {
  if (programId === "cart") {
    if (cartItems.length === 0) return null
    const total = cartItems.reduce((sum, id) => sum + (PROGRAM_PRICES[id] ?? 0), 0)
    return total > 0 ? total : null
  }
  if (programId === "flex-bundle") {
    if (bundleSelections.length < 2) return null
    // No bundle discount during $1 test period
    return bundleSelections.reduce((sum, id) => sum + (PROGRAM_PRICES[id] ?? 0), 0)
  }
  return PROGRAM_PRICES[programId] ?? null
}

export async function POST(req: NextRequest) {
  let body: {
    sourceId?: string
    programId?: string
    programName?: string
    amount?: number
    bundleSelections?: string[]
    cartItems?: string[]
    name?: string
    email?: string
    phone?: string
    studentName?: string
    parentFirstName?: string
    parentLastName?: string
    signUpForNews?: boolean
    country?: string
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    zipCode?: string
    grade?: string
    studentFirstName?: string
    studentLastName?: string
    studentEmail?: string
    studentPhone?: string
    highSchoolAttending?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const {
    sourceId,
    programId,
    bundleSelections = [],
    cartItems = [],
    name,
    email,
    phone,
    studentName,
    parentFirstName,
    parentLastName,
    signUpForNews,
    country,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    grade,
    studentFirstName,
    studentLastName,
    studentEmail,
    studentPhone,
    highSchoolAttending,
  } = body

  if (!sourceId || !programId || !name || !email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 422 })
  }

  if (!OPEN_PROGRAMS.includes(programId)) {
    return NextResponse.json(
      { error: "This program is not currently open for enrollment." },
      { status: 400 }
    )
  }

  // Compute amount server-side — never trust the client amount
  const amountCents = computeAmount(programId, bundleSelections, cartItems)
  if (!amountCents) {
    return NextResponse.json(
      { error: "Invalid program or cart selection." },
      { status: 400 }
    )
  }

  // Derive programId and programName for the DB record
  let dbProgramId = programId
  let dbProgramName: string
  if (programId === "cart") {
    dbProgramId = "cart:" + cartItems.join("+")
    dbProgramName = cartItems.map((id) => PROGRAM_NAMES[id] ?? id).join(", ")
  } else if (programId === "flex-bundle") {
    dbProgramName = "Flex Bundle: " + bundleSelections.map((id) => PROGRAM_NAMES[id] ?? id).join(", ")
  } else {
    dbProgramName = PROGRAM_NAMES[programId] ?? programId
  }

  const locationId = process.env.SQUARE_LOCATION_ID ?? ""

  // 1. Save PENDING enrollment before charging
  let enrollmentId: string
  try {
    const enrollment = await saveEnrollment({
      name,
      email,
      phone: phone ?? "",
      studentName: studentName ?? "",
      programId: dbProgramId,
      programName: dbProgramName,
      amountCents,
      squarePaymentId: "PENDING",
      parentFirstName: parentFirstName ?? "",
      parentLastName: parentLastName ?? "",
      signUpForNews: signUpForNews ?? false,
      country: country ?? "",
      addressLine1: addressLine1 ?? "",
      addressLine2: addressLine2 ?? "",
      city: city ?? "",
      state: state ?? "",
      zipCode: zipCode ?? "",
      grade: grade ?? "",
      studentFirstName: studentFirstName ?? "",
      studentLastName: studentLastName ?? "",
      studentEmail: studentEmail ?? "",
      studentPhone: studentPhone ?? "",
      highSchoolAttending: highSchoolAttending ?? "",
    })
    enrollmentId = enrollment.id
  } catch {
    enrollmentId = crypto.randomUUID()
  }

  // 2. Charge the card
  try {
    const paymentRes = await client.payments.create({
      sourceId,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: BigInt(amountCents),
        currency: "USD",
      },
      locationId,
      note: `AscendIQ enrollment: ${enrollmentId}${studentName ? ` (${studentName})` : ""}`,
    })

    const payment = paymentRes.payment
    const paymentId = payment?.id
    const receiptUrl = payment?.receiptUrl ?? undefined

    if (!paymentId) {
      return NextResponse.json({ error: "Payment failed. Please try again." }, { status: 500 })
    }

    // 3. Update enrollment with real payment ID
    await updateEnrollment(enrollmentId, { squarePaymentId: paymentId, receiptUrl })

    // 4. Notify LMS (fire-and-forget)
    const lmsUrl = process.env.LMS_INTERNAL_URL
    const enrollSecret = process.env.ENROLL_SECRET
    if (lmsUrl && enrollSecret) {
      fetch(`${lmsUrl}/api/internal/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Enroll-Secret": enrollSecret,
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone ?? "",
          studentName: studentName ?? "",
          studentEmail: studentEmail ?? "",
          programId: dbProgramId,
          programName: dbProgramName,
          squarePaymentId: paymentId,
        }),
      }).catch((err) => console.error("LMS notify failed:", err))
    }

    return NextResponse.json({ success: true, paymentId, receiptUrl })
  } catch (err: unknown) {
    console.error("Square CreatePayment error:", err)
    const squareErr = err as { errors?: Array<{ detail: string }> }
    const detail = squareErr?.errors?.[0]?.detail ?? "Payment failed. Please try again."
    return NextResponse.json({ error: detail }, { status: 500 })
  }
}

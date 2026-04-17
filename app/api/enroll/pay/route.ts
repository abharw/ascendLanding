import { NextRequest, NextResponse } from "next/server"
import { SquareClient, SquareEnvironment } from "square"
import { saveEnrollment, updateEnrollment } from "@/lib/enrollments-db"
import { OPEN_PROGRAMS, computeAmount, deriveProgramLabel } from "@/lib/programs"

export async function POST(req: NextRequest) {
  console.log("[pay] route called, env check:", {
    hasToken: !!process.env.SQUARE_ACCESS_TOKEN,
    env: process.env.SQUARE_ENVIRONMENT,
    locationId: process.env.SQUARE_LOCATION_ID,
  })
  try {
    return await handlePay(req)
  } catch (err) {
    console.error("[pay] unhandled error:", err)
    return NextResponse.json({ error: "Internal server error", detail: String(err) }, { status: 500 })
  }
}

async function handlePay(req: NextRequest) {
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
    hoodieSize?: string
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
    hoodieSize,
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
  const { dbProgramId, dbProgramName } = deriveProgramLabel(programId, bundleSelections, cartItems)

  const locationId = process.env.SQUARE_LOCATION_ID ?? ""

  const enrollmentData = {
    name,
    email,
    phone: phone ?? "",
    studentName: studentName ?? "",
    programId: dbProgramId,
    programName: dbProgramName,
    amountCents,
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
    hoodieSize: hoodieSize ?? "",
  }

  // 1. Save PENDING enrollment before charging
  let enrollmentId: string
  let dbSaveSucceeded = false
  try {
    const enrollment = await saveEnrollment({ ...enrollmentData, squarePaymentId: "PENDING" })
    enrollmentId = enrollment.id
    dbSaveSucceeded = true
  } catch {
    enrollmentId = crypto.randomUUID()
  }

  // 2. Charge the card
  const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN ?? "",
    environment:
      process.env.SQUARE_ENVIRONMENT === "production"
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
  })
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

    // 3. Update enrollment with real payment ID (or save full record if initial save failed)
    if (dbSaveSucceeded) {
      await updateEnrollment(enrollmentId, { squarePaymentId: paymentId, receiptUrl })
    } else {
      try {
        const saved = await saveEnrollment({ ...enrollmentData, squarePaymentId: paymentId, receiptUrl })
        enrollmentId = saved.id
      } catch (dbErr) {
        console.error("Failed to save enrollment after payment:", dbErr)
      }
    }

    // 4. Notify LMS (fire-and-forget); mark lmsSyncedAt on success
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
      })
        .then(() => updateEnrollment(enrollmentId, { lmsSyncedAt: new Date().toISOString() }))
        .catch((err) => console.error("LMS notify failed:", err))
    }

    return NextResponse.json({ success: true, paymentId, receiptUrl })
  } catch (err: unknown) {
    console.error("Square CreatePayment error:", err)
    const squareErr = err as { errors?: Array<{ detail: string }> }
    const detail = squareErr?.errors?.[0]?.detail ?? "Payment failed. Please try again."
    return NextResponse.json({ error: detail }, { status: 500 })
  }
}

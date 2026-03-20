import { NextRequest, NextResponse } from "next/server"
import { SquareClient, SquareEnvironment } from "square"
import { saveEnrollment } from "@/lib/enrollments-db"

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN ?? "",
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
})

function getBaseUrl(req: NextRequest): string {
  const host = req.headers.get("host") ?? "localhost:3000"
  const proto = req.headers.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https")
  return `${proto}://${host}`
}

export async function POST(req: NextRequest) {
  let body: {
    programId?: string
    programName?: string
    amount?: number
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
    programId,
    programName,
    amount,
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

  if (!programId || !amount || !name || !email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 422 })
  }

  // Only open programs accepted
  const OPEN_PROGRAMS = ["ascendiq-bootcamp", "flex-bundle", "test-payment"]
  if (!OPEN_PROGRAMS.includes(programId)) {
    return NextResponse.json(
      { error: "This program is not currently open for enrollment." },
      { status: 400 }
    )
  }

  // Enforce pricing per program (same as main enroll route)
  if (programId === "ascendiq-bootcamp") {
    const EXPECTED_CENTS = 149_500
    if (amount !== EXPECTED_CENTS) {
      return NextResponse.json(
        { error: "Invalid amount. Summer Startup Lab is $1,495 per student." },
        { status: 400 }
      )
    }
  } else if (programId === "flex-bundle") {
    const MIN_BUNDLE_CENTS = 149_900
    if (amount < MIN_BUNDLE_CENTS) {
      return NextResponse.json(
        { error: "Invalid amount. Flex Bundle starts at $1,499." },
        { status: 400 }
      )
    }
  } else if (programId === "test-payment") {
    if (amount !== 1) {
      return NextResponse.json(
        { error: "Test payment must be exactly $0.01." },
        { status: 400 }
      )
    }
  }

  const locationId = process.env.SQUARE_LOCATION_ID ?? ""

  try {
    // 1. Save pending enrollment first (squarePaymentId = "PENDING")
    let enrollmentId: string
    if (process.env.DYNAMODB_ENROLLMENTS_TABLE) {
      const enrollment = await saveEnrollment({
        name,
        email,
        phone: phone ?? "",
        studentName: studentName ?? "",
        programId,
        programName: programName ?? "",
        amountCents: amount,
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
    } else {
      enrollmentId = crypto.randomUUID()
    }

    const baseUrl = getBaseUrl(req)
    const redirectUrl = `${baseUrl}/enroll/success?enrollmentId=${enrollmentId}`

    // 2. Create Square-hosted payment link (CreatePaymentLink / quick pay)
    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: crypto.randomUUID(),
      quickPay: {
        name: programName ?? `AscendIQ — ${programId}`,
        priceMoney: {
          amount: BigInt(amount),
          currency: "USD",
        },
        locationId,
      },
      checkoutOptions: {
        redirectUrl,
      },
      paymentNote: `AscendIQ enrollment: ${enrollmentId}${studentName ? ` (Student: ${studentName})` : ""}`,
      prePopulatedData: {
        buyerEmail: email,
      },
    })

    const paymentLink = response.body.paymentLink
    const checkoutUrl = paymentLink?.url

    if (!checkoutUrl) {
      return NextResponse.json({ error: "Failed to create payment link" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      checkoutUrl,
      enrollmentId,
    })
  } catch (err: unknown) {
    console.error("Square CreatePaymentLink error:", err)
    const squareErr = err as { errors?: Array<{ detail: string }> }
    const detail = squareErr?.errors?.[0]?.detail ?? "Failed to create payment link. Please try again."
    return NextResponse.json({ error: detail }, { status: 500 })
  }
}

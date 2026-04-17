import { NextRequest, NextResponse } from "next/server"
import { SquareClient, SquareEnvironment } from "square"
import { saveEnrollment } from "@/lib/enrollments-db"


export async function POST(req: NextRequest) {
  let body: {
    sourceId?: string
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
    hoodieSize,
  } = body

  if (!sourceId || !programId || !amount || !name || !email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 422 })
  }

  // Only open programs accepted
  const OPEN_PROGRAMS = ["ascendiq-bootcamp", "flex-bundle"]
  if (!OPEN_PROGRAMS.includes(programId)) {
    return NextResponse.json(
      { error: "This program is not currently open for enrollment." },
      { status: 400 }
    )
  }

  // Enforce pricing per program
  if (programId === "ascendiq-bootcamp") {
    const EXPECTED_CENTS = 149_500
    if (amount !== EXPECTED_CENTS) {
      return NextResponse.json(
        { error: "Invalid amount. Summer Startup Lab is $1,495 per student." },
        { status: 400 }
      )
    }
  } else if (programId === "flex-bundle") {
    const MIN_BUNDLE_CENTS = 89_800
    if (amount < MIN_BUNDLE_CENTS) {
      return NextResponse.json(
        { error: "Invalid amount. Flex Bundle starts at $898." },
        { status: 400 }
      )
    }
  }

  const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN ?? "",
    environment:
      process.env.SQUARE_ENVIRONMENT === "production"
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
  })
  try {
    const response = await client.payments.create({
      sourceId,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: BigInt(amount),
        currency: "USD",
      },
      locationId: process.env.SQUARE_LOCATION_ID ?? "",
      note: `AscendIQ — ${programName}${studentName ? ` (Student: ${studentName})` : ""}`,
      buyerEmailAddress: email,
      referenceId: programId,
    })

    const payment = response.payment

    // ── Save to DynamoDB ──────────────────────────────────────────────────
    try {
      await saveEnrollment({
        name,
        email,
        phone: phone ?? "",
        studentName: studentName ?? "",
        programId,
        programName: programName ?? "",
        amountCents: amount,
        squarePaymentId: payment?.id ?? "",
        receiptUrl: payment?.receiptUrl,
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
      })
    } catch (dbErr) {
      console.error("DynamoDB enrollment save failed:", dbErr)
      // Payment succeeded — don't fail the response; enrollment is in Square
    }

    // ── Notify LMS to create student account ───────────────────────────────
    const lmsUrl = process.env.LMS_INTERNAL_URL
    const enrollSecret = process.env.ENROLL_SECRET
    if (lmsUrl && enrollSecret) {
      try {
        const lmsRes = await fetch(`${lmsUrl}/api/internal/enroll`, {
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
            studentEmail: "",
            programId,
            programName: programName ?? "",
            squarePaymentId: payment?.id ?? "",
          }),
        })
        if (!lmsRes.ok) {
          const lmsErr = await lmsRes.text()
          console.error("LMS enroll error:", lmsRes.status, lmsErr)
          // Payment already succeeded — don't fail the response.
          // The team can manually provision the account if the LMS call fails.
        }
      } catch (lmsErr) {
        console.error("LMS enroll fetch failed:", lmsErr)
      }
    }

    return NextResponse.json({
      success: true,
      paymentId: payment?.id,
      receiptUrl: payment?.receiptUrl,
    })
  } catch (err: unknown) {
    console.error("Square payment error:", err)

    // Surface Square API errors clearly
    const squareErr = err as { errors?: Array<{ detail: string }> }
    const detail = squareErr?.errors?.[0]?.detail ?? "Payment failed. Please try again."

    return NextResponse.json({ error: detail }, { status: 402 })
  }
}

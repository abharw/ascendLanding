import { NextRequest, NextResponse } from "next/server"
import { SquareClient, SquareEnvironment } from "square"

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN ?? "",
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
})

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
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { sourceId, programId, programName, amount, name, email, phone, studentName } = body

  if (!sourceId || !programId || !amount || !name || !email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 422 })
  }

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

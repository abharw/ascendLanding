import { NextRequest, NextResponse } from "next/server"
import { SquareClient, SquareEnvironment } from "square"
import { getEnrollment, updateEnrollment } from "@/lib/enrollments-db"

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN ?? "",
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
})

export async function POST(req: NextRequest) {
  let body: { enrollmentId?: string; orderId?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { enrollmentId, orderId } = body

  if (!enrollmentId || !orderId) {
    return NextResponse.json(
      { error: "Missing enrollmentId or orderId" },
      { status: 422 }
    )
  }

  try {
    const enrollment = await getEnrollment(enrollmentId)
    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    if (enrollment.squarePaymentId !== "PENDING") {
      // Already completed (e.g. duplicate callback)
      return NextResponse.json({
        success: true,
        paymentId: enrollment.squarePaymentId,
        receiptUrl: enrollment.receiptUrl,
      })
    }

    // Retrieve order from Square to get payment_id
    const orderRes = await client.orders.get({ orderId })
    const order = orderRes.body.order

    if (!order?.tenders?.length) {
      return NextResponse.json(
        { error: "No payment found for this order" },
        { status: 400 }
      )
    }

    const paymentId = order.tenders[0].paymentId ?? order.tenders[0].id
    if (!paymentId) {
      return NextResponse.json(
        { error: "Could not determine payment ID" },
        { status: 400 }
      )
    }

    let receiptUrl: string | undefined
    try {
      const paymentRes = await client.payments.getPayment(paymentId)
      receiptUrl = paymentRes.body.payment?.receiptUrl
    } catch {
      // Non-fatal; we have paymentId
    }

    await updateEnrollment(enrollmentId, {
      squarePaymentId: paymentId,
      receiptUrl,
    })

    // Notify LMS (same as main enroll route)
    const lmsUrl = process.env.LMS_INTERNAL_URL
    const enrollSecret = process.env.ENROLL_SECRET
    if (lmsUrl && enrollSecret) {
      try {
        await fetch(`${lmsUrl}/api/internal/enroll`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Enroll-Secret": enrollSecret,
          },
          body: JSON.stringify({
            name: enrollment.name,
            email: enrollment.email,
            phone: enrollment.phone ?? "",
            studentName: enrollment.studentName ?? "",
            studentEmail: enrollment.studentEmail ?? "",
            programId: enrollment.programId,
            programName: enrollment.programName ?? "",
            squarePaymentId: paymentId,
          }),
        })
      } catch (lmsErr) {
        console.error("LMS enroll fetch failed:", lmsErr)
      }
    }

    return NextResponse.json({
      success: true,
      paymentId,
      receiptUrl,
    })
  } catch (err: unknown) {
    console.error("Complete enrollment error:", err)
    const squareErr = err as { errors?: Array<{ detail: string }> }
    const detail = squareErr?.errors?.[0]?.detail ?? "Failed to complete enrollment."
    return NextResponse.json({ error: detail }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"

// Verify the request is genuinely from Square using HMAC-SHA256
function verifySquareSignature(
  body: string,
  signature: string | null,
  notificationUrl: string,
): boolean {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY
  if (!key || !signature) return false
  const payload = notificationUrl + body
  const expected = createHmac("sha256", key).update(payload).digest("base64")
  return expected === signature
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get("x-square-hmacsha256-signature")

  // Build the full notification URL Square signed against
  const proto = req.headers.get("x-forwarded-proto") ?? "https"
  const host = req.headers.get("host") ?? ""
  const notificationUrl = `${proto}://${host}/api/webhooks/square`

  if (!verifySquareSignature(rawBody, signature, notificationUrl)) {
    console.warn("Square webhook signature verification failed")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let event: {
    type?: string
    data?: {
      object?: {
        payment?: {
          id?: string
          status?: string
          receipt_url?: string
        }
      }
    }
  }

  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  // Only care about completed payments
  if (event.type !== "payment.updated" && event.type !== "payment.created") {
    return NextResponse.json({ received: true })
  }

  const payment = event.data?.object?.payment
  if (!payment?.id || payment.status !== "COMPLETED") {
    return NextResponse.json({ received: true })
  }

  // Find the enrollment by squarePaymentId and mark LMS sync
  // (The primary confirmation already happened in /api/enroll/pay — this is a backup)
  try {
    const { getEnrollmentByPaymentId, updateEnrollment } = await import("@/lib/enrollments-db")
    if (getEnrollmentByPaymentId) {
      const enrollment = await getEnrollmentByPaymentId(payment.id)
      if (enrollment && !enrollment.lmsSyncedAt) {
        await updateEnrollment(enrollment.id, {
          lmsSyncedAt: new Date().toISOString(),
        })

        const lmsUrl = process.env.LMS_INTERNAL_URL
        const enrollSecret = process.env.ENROLL_SECRET
        if (lmsUrl && enrollSecret) {
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
              squarePaymentId: payment.id,
            }),
          })
        }
      }
    }
  } catch (err) {
    console.error("Webhook enrollment lookup failed:", err)
  }

  return NextResponse.json({ received: true })
}

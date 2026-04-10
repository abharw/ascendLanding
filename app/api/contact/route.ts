import { NextRequest, NextResponse } from "next/server"

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? ""
const FROM_EMAIL = "AscendIQ <hello@ascendiq.work>"
const TO_EMAILS = (process.env.CONTACT_EMAIL_TO ?? "")
  .split(",")
  .map((addr) => addr.trim())
  .filter(Boolean)

const AUDIENCE_LABELS: Record<string, string> = {
  school: "School / District",
  parent: "Parent / Guardian",
  employer: "Employer / Industry Partner",
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function POST(req: NextRequest) {
  let body: {
    name?: string
    email?: string
    organization?: string
    subject?: string
    message?: string
    audience?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { name, email, organization, subject, message, audience } = body

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 422 }
    )
  }

  const audienceLabel = audience ? (AUDIENCE_LABELS[audience] ?? audience) : "General Inquiry"
  const subjectLine = subject?.trim() || `New inquiry from ${name}`
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "full",
    timeStyle: "short",
  })

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeOrg = organization ? escapeHtml(organization) : ""
  const safeSubject = subject ? escapeHtml(subject) : ""
  const safeMessage = escapeHtml(message)
  const safeAudience = escapeHtml(audienceLabel)
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Re: " + subjectLine)}`

  const labelStyle = "padding: 14px 0 14px; border-bottom: 1px solid #E2E8F0; width: 130px; color: #475569; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;"
  const valueStyle = "padding: 14px 0 14px; border-bottom: 1px solid #E2E8F0; color: #0F172A; font-size: 15px; line-height: 1.5;"

  const notificationHtml = `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 620px; margin: 0 auto; background: #F8FAFC; padding: 32px 16px;">
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 5px; overflow: hidden;">
        <div style="background: #3f5f76; padding: 32px;">
          <p style="color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 10px;">New Inquiry</p>
          <h1 style="color: #FFFFFF; font-size: 22px; margin: 0; font-weight: 700; letter-spacing: -0.01em; line-height: 1.3;">Contact Form Submission</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 13px;">${escapeHtml(timestamp)}</p>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="${labelStyle}">Audience</td>
              <td style="${valueStyle}">${safeAudience}</td>
            </tr>
            <tr>
              <td style="${labelStyle}">Name</td>
              <td style="${valueStyle}">${safeName}</td>
            </tr>
            <tr>
              <td style="${labelStyle}">Email</td>
              <td style="${valueStyle}"><a href="mailto:${encodeURIComponent(email)}" style="color: #3f5f76; text-decoration: none; font-weight: 500;">${safeEmail}</a></td>
            </tr>
            ${safeOrg ? `
            <tr>
              <td style="${labelStyle}">Organization</td>
              <td style="${valueStyle}">${safeOrg}</td>
            </tr>` : ""}
            ${safeSubject ? `
            <tr>
              <td style="${labelStyle}">Subject</td>
              <td style="${valueStyle}">${safeSubject}</td>
            </tr>` : ""}
            <tr>
              <td style="${labelStyle} border-bottom: none;">Message</td>
              <td style="padding: 14px 0 0; color: #0F172A; font-size: 15px; line-height: 1.65; white-space: pre-wrap;">${safeMessage}</td>
            </tr>
          </table>
          <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #E2E8F0;">
            <a href="${replyHref}" style="display: inline-block; background: #3f5f76; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 14px; font-weight: 500; letter-spacing: 0.01em;">
              Reply to ${safeName}
            </a>
          </div>
        </div>
      </div>
      <div style="text-align: center; padding: 24px 16px 0; color: #94A3B8; font-size: 12px; line-height: 1.6;">
        <p style="margin: 0;">AscendIQ &mdash; Preparing American workers for the technology-enabled economy.</p>
        <p style="margin: 6px 0 0;">Sent from the contact form at <a href="https://ascendiq.work" style="color: #3f5f76; text-decoration: none;">ascendiq.work</a></p>
      </div>
    </div>
  `

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAILS,
        subject: `[AscendIQ] ${audienceLabel}: ${subjectLine}`,
        html: notificationHtml,
        reply_to: email,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      const msg = err.message ?? `Resend API error (${res.status})`
      console.error("Resend error:", msg)
      return NextResponse.json(
        { error: "Failed to send. Please try again or email us directly." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("Resend error:", message)
    return NextResponse.json(
      { error: "Failed to send. Please try again or email us directly." },
      { status: 500 }
    )
  }
}

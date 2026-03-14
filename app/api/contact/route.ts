import { Resend } from "resend"
import { NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.CONTACT_EMAIL_FROM ?? "AscendIQ <onboarding@resend.dev>"
const TO_EMAIL = process.env.CONTACT_EMAIL_TO ?? "team@ascendiq.com"

const AUDIENCE_LABELS: Record<string, string> = {
  school: "School / District",
  parent: "Parent / Guardian",
  employer: "Employer / Industry Partner",
}

// Per-audience Resend lists — falls back to general RESEND_AUDIENCE_ID
const AUDIENCE_ID_MAP: Record<string, string | undefined> = {
  school: process.env.RESEND_AUDIENCE_ID_SCHOOLS,
  parent: process.env.RESEND_AUDIENCE_ID_PARENTS,
  employer: process.env.RESEND_AUDIENCE_ID_EMPLOYERS,
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

  // --- Notification email to team ---
  const notificationHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
      <div style="background: #111; padding: 24px 32px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; font-size: 20px; margin: 0;">New Contact Submission</h1>
        <p style="color: #888; margin: 4px 0 0; font-size: 14px;">AscendIQ — ${timestamp}</p>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: none; padding: 32px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; width: 130px; color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Audience</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px;">${audienceLabel}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
          </tr>
          ${organization ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Organization</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px;">${organization}</td>
          </tr>` : ""}
          ${subject ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Subject</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px;">${subject}</td>
          </tr>` : ""}
          <tr>
            <td style="padding: 10px 0; color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subjectLine)}" style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 500;">
            Reply to ${name}
          </a>
        </div>
      </div>
    </div>
  `

  // --- Confirmation email to submitter ---
  const confirmationHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
      <div style="background: #111; padding: 24px 32px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; font-size: 22px; margin: 0;">Thanks for reaching out, ${name.split(" ")[0]}.</h1>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: none; padding: 32px; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          We received your message and will get back to you within <strong>24 hours</strong>.
        </p>
        <p style="font-size: 15px; color: #555; line-height: 1.6; margin: 0 0 28px;">
          In the meantime, explore our programs at
          <a href="https://ascendiq.com/programs" style="color: #2563eb;">ascendiq.com/programs</a>.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 13px; color: #888; margin: 0;">
          AscendIQ — Preparing American workers for the technology-enabled economy.<br/>
          You're receiving this because you submitted a contact form at ascendiq.com.
        </p>
      </div>
    </div>
  `

  // Add to the matching Resend Audience (fire-and-forget)
  const targetAudienceId =
    (audience && AUDIENCE_ID_MAP[audience]) ?? process.env.RESEND_AUDIENCE_ID

  if (targetAudienceId) {
    const [firstName, ...rest] = name.trim().split(" ")
    resend.contacts.create({
      email,
      firstName,
      lastName: rest.join(" ") || undefined,
      unsubscribed: false,
      audienceId: targetAudienceId,
    }).catch((err) => console.error("Resend audience sync failed:", err))
  }

  try {
    await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        replyTo: email,
        subject: `[AscendIQ] ${audienceLabel}: ${subjectLine}`,
        html: notificationHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "We got your message — AscendIQ",
        html: confirmationHtml,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Resend error:", err)
    return NextResponse.json(
      { error: "Failed to send. Please try again or email us directly." },
      { status: 500 }
    )
  }
}

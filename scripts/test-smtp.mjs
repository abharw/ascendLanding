/**
 * Test contact form email delivery via Resend.
 * Run: node --env-file=.env scripts/test-smtp.mjs
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? ""
const FROM_EMAIL = process.env.CONTACT_EMAIL_FROM ?? "AscendIQ <hello@ascendiq.work>"
const TO_EMAILS = (process.env.CONTACT_EMAIL_TO ?? "")
  .split(",")
  .map((addr) => addr.trim())
  .filter(Boolean)

if (!RESEND_API_KEY) {
  console.error("Missing RESEND_API_KEY. Set it in .env")
  process.exit(1)
}

if (TO_EMAILS.length === 0) {
  console.error("Missing CONTACT_EMAIL_TO. Set it in .env")
  process.exit(1)
}

const timestamp = new Date().toLocaleString("en-US", {
  timeZone: "America/New_York",
  dateStyle: "full",
  timeStyle: "short",
})

const sample = {
  name: "Jane Smith",
  email: "jane.smith@lincolnschools.org",
  organization: "Lincoln County School District",
  subject: "Apprenticeship pathway for our high school",
  message: "Hi AscendIQ team,\n\nWe're interested in bringing your apprenticeship program to our 11th and 12th graders. We have about 240 students who would qualify, and we're looking for a partner that can handle both the curriculum and the industry placements.\n\nCould we schedule a discovery call next week?\n\nThanks,\nJane",
  audience: "School / District",
}

const labelStyle = "padding: 14px 0 14px; border-bottom: 1px solid #E2E8F0; width: 130px; color: #475569; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;"
const valueStyle = "padding: 14px 0 14px; border-bottom: 1px solid #E2E8F0; color: #0F172A; font-size: 15px; line-height: 1.5;"

const html = `
  <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 620px; margin: 0 auto; background: #F8FAFC; padding: 32px 16px;">
    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 5px; overflow: hidden;">
      <div style="background: #3f5f76; padding: 32px;">
        <p style="color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 10px;">New Inquiry &middot; Preview</p>
        <h1 style="color: #FFFFFF; font-size: 22px; margin: 0; font-weight: 700; letter-spacing: -0.01em; line-height: 1.3;">Contact Form Submission</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 13px;">${timestamp}</p>
      </div>
      <div style="padding: 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="${labelStyle}">Audience</td><td style="${valueStyle}">${sample.audience}</td></tr>
          <tr><td style="${labelStyle}">Name</td><td style="${valueStyle}">${sample.name}</td></tr>
          <tr><td style="${labelStyle}">Email</td><td style="${valueStyle}"><a href="mailto:${sample.email}" style="color: #3f5f76; text-decoration: none; font-weight: 500;">${sample.email}</a></td></tr>
          <tr><td style="${labelStyle}">Organization</td><td style="${valueStyle}">${sample.organization}</td></tr>
          <tr><td style="${labelStyle}">Subject</td><td style="${valueStyle}">${sample.subject}</td></tr>
          <tr><td style="${labelStyle} border-bottom: none;">Message</td><td style="padding: 14px 0 0; color: #0F172A; font-size: 15px; line-height: 1.65; white-space: pre-wrap;">${sample.message}</td></tr>
        </table>
        <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #E2E8F0;">
          <a href="mailto:${sample.email}?subject=Re: ${encodeURIComponent(sample.subject)}" style="display: inline-block; background: #3f5f76; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 14px; font-weight: 500; letter-spacing: 0.01em;">Reply to ${sample.name}</a>
        </div>
      </div>
    </div>
    <div style="text-align: center; padding: 24px 16px 0; color: #94A3B8; font-size: 12px; line-height: 1.6;">
      <p style="margin: 0;">AscendIQ &mdash; Preparing American workers for the technology-enabled economy.</p>
      <p style="margin: 6px 0 0;">Sent from the contact form at <a href="https://ascendiq.work" style="color: #3f5f76; text-decoration: none;">ascendiq.work</a></p>
    </div>
  </div>
`

console.log(`Testing Resend API...`)
console.log(`From: ${FROM_EMAIL}`)
console.log(`To: ${TO_EMAILS.join(", ")}`)

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
      subject: `[AscendIQ] ${sample.audience}: ${sample.subject}`,
      html,
      reply_to: sample.email,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    console.error(`✗ Resend API error (${res.status}):`, data.message ?? JSON.stringify(data))
    process.exit(1)
  }

  console.log("✓ Sent:", data.id)
  console.log("\nResend transport OK. Check your inbox.")
} catch (err) {
  console.error("✗ Request failed:", err.message)
  process.exit(1)
}

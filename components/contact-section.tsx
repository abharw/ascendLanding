"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

type Status = "idle" | "loading" | "success" | "error"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  })
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong.")
      setStatus("success")
      setFormData({ name: "", email: "", organization: "", message: "" })
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
              Get in Touch
            </p>
            <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground text-balance leading-tight">
              Partner With Us. Build Workforce Capacity in Your Community.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Schools: bring our apprenticeship pathways and technical assistance to your
              students. Industry: align with workforce development. Families: access
              equitable training that leads to good-paying roles. One form — we&apos;ll
              connect within 24 hours.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <span className="text-primary font-bold">01</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Submit Your Inquiry</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    School partnership, community development, or workforce initiative — we&apos;ll route you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <span className="text-primary font-bold">02</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Discovery Call</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    We&apos;ll schedule a brief call to understand your goals and needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <span className="text-primary font-bold">03</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Get Matched</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    We&apos;ll connect you with the right program or partnership.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-8 lg:p-10">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center h-full min-h-[320px] gap-4">
                <CheckCircle className="h-12 w-12 text-primary" />
                <h3 className="font-semibold text-xl text-foreground">Message sent!</h3>
                <p className="text-muted-foreground">
                  We&apos;ll get back to you within 24 hours. Check your email for a confirmation.
                </p>
                <Button variant="outline" onClick={() => setStatus("idle")} className="mt-2">
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="cs-name" className="text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <Input
                      id="cs-name"
                      placeholder="Jane Smith"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="cs-email" className="text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <Input
                      id="cs-email"
                      type="email"
                      placeholder="jane@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="cs-organization" className="text-sm font-medium text-foreground">
                    Organization
                  </label>
                  <Input
                    id="cs-organization"
                    placeholder="Company or Organization Name"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="cs-message" className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <Textarea
                    id="cs-message"
                    placeholder="School partnership? Community development? Workforce initiative? Tell us your goal..."
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-secondary border-border resize-none"
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "loading"}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

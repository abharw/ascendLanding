"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, AlertCircle, Loader2, GraduationCap, Users, Building2, MessageSquare } from "lucide-react"

type Status = "idle" | "loading" | "success" | "error"
type AudienceKey = "school" | "parent" | "employer" | ""

const audienceTabs: { key: AudienceKey; label: string; icon: React.ElementType }[] = [
  { key: "", label: "General", icon: MessageSquare },
  { key: "school", label: "For Schools", icon: GraduationCap },
  { key: "parent", label: "For Parents", icon: Users },
  { key: "employer", label: "For Employers", icon: Building2 },
]

const audienceContent: Record<string, {
  title: string
  subtext: string
  orgLabel: string
  orgPlaceholder: string
  subjectPlaceholder: string
  messagePlaceholder: string
}> = {
  school: {
    title: "Bring AscendIQ to Your School",
    subtext: "Partner with us for turnkey curriculum, apprenticeship pathways, and technical assistance. We'll bring workforce readiness to your students—response within 24 hours.",
    orgLabel: "School or District Name",
    orgPlaceholder: "e.g. Lincoln Charter Academy",
    subjectPlaceholder: "e.g. Curriculum partnership for 9th–12th grade",
    messagePlaceholder: "Tell us about your school, student count, and goals for workforce readiness...",
  },
  parent: {
    title: "Enroll Your Student",
    subtext: "Give your student access to apprenticeships, applied skills, and pathways to good-paying roles. We'll match them with the right program—response within 24 hours.",
    orgLabel: "School (if applicable)",
    orgPlaceholder: "e.g. Local high school or homeschool",
    subjectPlaceholder: "e.g. Apprenticeship program for my 16-year-old",
    messagePlaceholder: "Tell us about your student, their interests, and which program you're considering...",
  },
  employer: {
    title: "Partner on Workforce Development",
    subtext: "Align with our apprenticeship pathways and technical assistance to build your talent pipeline. We connect trained workers with industry partners—response within 24 hours.",
    orgLabel: "Company or Organization",
    orgPlaceholder: "e.g. Acme Manufacturing",
    subjectPlaceholder: "e.g. Apprenticeship partnership or hiring pipeline",
    messagePlaceholder: "Tell us about your workforce needs, industry, and how you'd like to engage...",
  },
}

const defaultContent = {
  title: "Get in Touch",
  subtext: "Enrolling your kids? Bringing AscendIQ to your school? Ready to partner on workforce development? Tell us what you need—we'll get back to you within 24 hours.",
  orgLabel: "Organization",
  orgPlaceholder: "Company or Organization Name",
  subjectPlaceholder: "What is this regarding?",
  messagePlaceholder: "Enrolling a child? Partnering your school? Workforce initiative? Tell us your goal...",
}

export default function ContactPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const paramAudience = (searchParams.get("audience") ?? "") as AudienceKey
  const [audience, setAudience] = useState<AudienceKey>(paramAudience)

  const content = (audience && audienceContent[audience]) ?? defaultContent

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  // Keep URL in sync when tab changes
  const handleTabChange = (key: AudienceKey) => {
    setAudience(key)
    setStatus("idle")
    const params = new URLSearchParams(searchParams.toString())
    if (key) {
      params.set("audience", key)
    } else {
      params.delete("audience")
    }
    router.replace(`/contact?${params.toString()}`, { scroll: false })
  }

  // Sync if URL param changes externally (e.g. back/forward)
  useEffect(() => {
    setAudience(paramAudience)
  }, [paramAudience])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, audience }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong.")
      setStatus("success")
      setFormData({ name: "", email: "", organization: "", subject: "", message: "" })
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">

          {/* Audience tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {audienceTabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  audience === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            {audience ? audienceTabs.find(t => t.key === audience)?.label : "Get in Touch"}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground text-balance leading-tight">
            {content.title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {content.subtext}
          </p>

          <div className="mt-12 bg-card border border-border rounded-lg p-8 lg:p-12">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center min-h-[320px] gap-4 py-8">
                <CheckCircle className="h-14 w-14 text-primary" />
                <h2 className="font-semibold text-2xl text-foreground">Message sent!</h2>
                <p className="text-muted-foreground max-w-sm">
                  We&apos;ll get back to you within 24 hours. Check your inbox for a confirmation email.
                </p>
                <Button variant="outline" onClick={() => setStatus("idle")} className="mt-2">
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Jane Smith"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12 bg-secondary border-border text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 bg-secondary border-border text-base"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="organization" className="text-sm font-medium text-foreground">
                    {content.orgLabel}
                  </label>
                  <Input
                    id="organization"
                    placeholder={content.orgPlaceholder}
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="h-12 bg-secondary border-border text-base"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="subject" className="text-sm font-medium text-foreground">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder={content.subjectPlaceholder}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="h-12 bg-secondary border-border text-base"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder={content.messagePlaceholder}
                    rows={8}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-secondary border-border resize-none text-base min-h-[200px] py-4"
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
                  className="w-full h-14 text-base bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
      </section>

      <Footer />
    </main>
  )
}

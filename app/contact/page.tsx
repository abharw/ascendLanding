"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  WarningCircle,
  CircleNotch,
  GraduationCap,
  Users,
  Buildings,
  ChatCircle,
  Medal,
  HouseLine,
} from "@phosphor-icons/react"

type Status = "idle" | "loading" | "success" | "error"
type AudienceKey = "school" | "parent" | "employer" | "schoolDistrict" | "sponsor" | "mentor" | ""

const audienceTabs: { key: AudienceKey; label: string; icon: React.ElementType }[] = [
  { key: "", label: "General", icon: ChatCircle },
  { key: "school", label: "For Schools", icon: GraduationCap },
  { key: "schoolDistrict", label: "School Districts", icon: HouseLine },
  { key: "parent", label: "For Parents", icon: Users },
  { key: "employer", label: "For Employers", icon: Buildings },
  { key: "mentor", label: "Become a Mentor", icon: Users },
  { key: "sponsor", label: "Sponsors", icon: Medal },
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
  schoolDistrict: {
    title: "Custom Contracts for School Districts",
    subtext: "Bring AscendIQ to your district with custom contracts and pricing. We'll discuss your scale, goals, and partnership structure—response within 24 hours.",
    orgLabel: "School District Name",
    orgPlaceholder: "e.g. City Unified School District",
    subjectPlaceholder: "e.g. District-wide workforce readiness partnership",
    messagePlaceholder: "Tell us about your district size, student count, and workforce development goals...",
  },
  sponsor: {
    title: "Join as a Sponsor",
    subtext: "Invest in the next generation. Silver, Gold, and Platinum tiers from $5k to $25k. Push your products, connect with students, and build lasting impact.",
    orgLabel: "Company or Organization",
    orgPlaceholder: "e.g. Acme Corp",
    subjectPlaceholder: "e.g. Platinum sponsorship inquiry",
    messagePlaceholder: "Tell us which tier interests you and how you'd like to engage...",
  },
  mentor: {
    title: "Become a Mentor",
    subtext: "Get paired with students à la carte. Share your expertise, give back, and be recognized as someone who builds future builders.",
    orgLabel: "Current Role / Industry",
    orgPlaceholder: "e.g. Tech founder, Marketing Director",
    subjectPlaceholder: "e.g. Mentorship for entrepreneurship program",
    messagePlaceholder: "Tell us about your background and how you'd like to mentor...",
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

function ContactPageContent() {
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
                <CheckCircle className="size-14 text-primary" />
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
                      <CircleNotch className="mr-2 size-5 animate-spin" />
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

function ContactPageFallback() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 flex items-center justify-center min-h-[400px]">
          <CircleNotch className="size-10 animate-spin text-muted-foreground" />
        </div>
      </section>
      <Footer />
    </main>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactPageFallback />}>
      <ContactPageContent />
    </Suspense>
  )
}

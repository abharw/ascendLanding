"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, ArrowLeft, Check, CheckCircle, Loader2, AlertCircle, ExternalLink } from "lucide-react"

// ─── Program data (replace with CMS / DB later) ───────────────────────────
const PROGRAMS = [
  {
    id: "startup-lab",
    name: "Entrepreneurship Training",
    cohort: "Spring 2026",
    startDate: "March 15, 2026",
    duration: "12 weeks · 2 sessions/week",
    ageRange: "Ages 14–22",
    spotsLeft: 8,
    price: 49900, // cents
    priceDisplay: "$499",
    description:
      "Build and launch a real venture. Develop the execution, initiative, and problem-solving skills that remain quintessentially human in the age of automation.",
  },
  {
    id: "skills-internships",
    name: "Technical Proficiency & Apprenticeships",
    cohort: "Spring 2026",
    startDate: "April 1, 2026",
    duration: "8 weeks · Project-based",
    ageRange: "Ages 13–21",
    spotsLeft: 12,
    price: 34900,
    priceDisplay: "$349",
    description:
      "Gain hands-on expertise through technical training and apprenticeship pathways. Build a portfolio that stands out when entry-level roles are scarce.",
  },
  {
    id: "career-training",
    name: "Pathways to Good-Paying Roles",
    cohort: "Rolling Enrollment",
    startDate: "Flexible start date",
    duration: "6 months · 1:1 mentorship",
    ageRange: "Ages 16–24",
    spotsLeft: 5,
    price: 59900,
    priceDisplay: "$599",
    description:
      "Structured transition from training to high-impact employment. Paired with a mentor from your target industry, plus career mapping and interview prep.",
  },
]

type Step = 1 | 2 | 3
type Program = (typeof PROGRAMS)[number]

const SQUARE_APP_ID = process.env.NEXT_PUBLIC_SQUARE_APP_ID ?? ""
const SQUARE_LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? ""
const SQUARE_SCRIPT =
  process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production"
    ? "https://web.squarecdn.com/v1/square.js"
    : "https://sandbox.web.squarecdn.com/v1/square.js"

// ─── Step indicator ────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  const steps = ["Choose Program", "Your Info", "Payment"]
  return (
    <div className="flex items-center gap-2 mb-12">
      {steps.map((label, i) => {
        const n = (i + 1) as Step
        const done = current > n
        const active = current === n
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : n}
            </div>
            <span
              className={`text-sm font-medium hidden sm:block ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`h-px w-8 lg:w-16 mx-1 ${current > n ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Program selection ─────────────────────────────────────────────
function ProgramStep({
  selected,
  onSelect,
  onNext,
}: {
  selected: Program | null
  onSelect: (p: Program) => void
  onNext: () => void
}) {
  return (
    <div>
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground text-balance leading-tight mb-3">
        Open Enrollment
      </h1>
      <p className="text-muted-foreground mb-10">
        Select a program to enroll. All programs include mentorship, curriculum, and portfolio support.
      </p>

      <div className="space-y-4 mb-10">
        {PROGRAMS.map((program) => (
          <button
            key={program.id}
            onClick={() => onSelect(program)}
            className={`w-full text-left rounded-lg border p-6 transition-all duration-200 ${
              selected?.id === program.id
                ? "border-primary bg-primary/[0.04] ring-1 ring-primary/30"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h2 className="font-semibold text-foreground">{program.name}</h2>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {program.cohort}
                  </span>
                  {program.spotsLeft <= 5 && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      {program.spotsLeft} spots left
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{program.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>📅 {program.startDate}</span>
                  <span>⏱ {program.duration}</span>
                  <span>👤 {program.ageRange}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-bold text-2xl text-foreground">{program.priceDisplay}</div>
                <div className="text-xs text-muted-foreground">per student</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Button
        size="lg"
        disabled={!selected}
        onClick={onNext}
        className="w-full sm:w-auto h-12 px-8"
      >
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

// ─── Step 2: Contact / student info ───────────────────────────────────────
function InfoStep({
  program,
  info,
  onChange,
  onBack,
  onNext,
}: {
  program: Program
  info: { name: string; email: string; phone: string; studentName: string }
  onChange: (key: string, value: string) => void
  onBack: () => void
  onNext: () => void
}) {
  const valid = info.name.trim() && info.email.trim()

  return (
    <div>
      {/* Selected program summary */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4 mb-10">
        <div>
          <div className="font-medium text-foreground text-sm">{program.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{program.startDate} · {program.duration}</div>
        </div>
        <div className="font-bold text-foreground">{program.priceDisplay}</div>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-foreground mb-8">
        Your Information
      </h2>

      <div className="space-y-6 mb-10">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Your Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              placeholder="Jane Smith"
              required
              value={info.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="h-12 bg-secondary border-border text-base"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address <span className="text-destructive">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="jane@email.com"
              required
              value={info.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="h-12 bg-secondary border-border text-base"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              Phone (optional)
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 000-0000"
              value={info.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="h-12 bg-secondary border-border text-base"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="studentName" className="text-sm font-medium text-foreground">
              Student&apos;s Name (if different)
            </label>
            <Input
              id="studentName"
              placeholder="Leave blank if enrolling yourself"
              value={info.studentName}
              onChange={(e) => onChange("studentName", e.target.value)}
              className="h-12 bg-secondary border-border text-base"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} className="h-12 px-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button size="lg" disabled={!valid} onClick={onNext} className="h-12 px-8">
          Continue to Payment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Step 3: Payment ───────────────────────────────────────────────────────
function PaymentStep({
  program,
  info,
  onBack,
  onSuccess,
}: {
  program: Program
  info: { name: string; email: string; phone: string; studentName: string }
  onBack: () => void
  onSuccess: (paymentId: string, receiptUrl?: string) => void
}) {
  const cardRef = useRef<Window["Square"] extends infer S ? (S extends { payments(...args: unknown[]): Promise<infer P> } ? (P extends { card(...args: unknown[]): Promise<infer C> } ? C : never) : never) : never>(null)
  const [sdkReady, setSdkReady] = useState(false)
  const [cardReady, setCardReady] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  // Initialize Square card form once SDK is ready
  useEffect(() => {
    if (!sdkReady || !window.Square) return

    let mounted = true

    async function initCard() {
      const payments = await window.Square!.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID)
      const card = await payments.card()
      await card.attach("#sq-card-container")
      if (mounted) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(cardRef as any).current = card
        setCardReady(true)
      }
    }

    initCard().catch(console.error)

    return () => {
      mounted = false
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(cardRef as any).current?.destroy().catch(() => null)
    }
  }, [sdkReady])

  const handlePay = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const card = (cardRef as any).current
    if (!card) return

    setStatus("loading")
    setErrorMsg("")

    const result = await card.tokenize()
    if (result.status !== "OK" || !result.token) {
      setStatus("error")
      setErrorMsg(result.errors?.[0]?.message ?? "Card tokenization failed.")
      return
    }

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: result.token,
          programId: program.id,
          programName: program.name,
          amount: program.price,
          name: info.name,
          email: info.email,
          phone: info.phone,
          studentName: info.studentName,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Payment failed.")
      onSuccess(data.paymentId, data.receiptUrl)
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Payment failed. Please try again.")
    } finally {
      if (status !== "idle") setStatus("idle")
    }
  }

  return (
    <div>
      {/* Load Square SDK */}
      <Script src={SQUARE_SCRIPT} onLoad={() => setSdkReady(true)} />

      {/* Program + order summary */}
      <div className="rounded-lg border border-border bg-card px-5 py-4 mb-10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-foreground text-sm">{program.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{program.startDate}</div>
          </div>
          <div className="font-bold text-foreground">{program.priceDisplay}</div>
        </div>
        <div className="border-t border-border pt-3 flex justify-between text-sm">
          <span className="text-muted-foreground">Enrolling</span>
          <span className="font-medium text-foreground">{info.studentName || info.name}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span>Total</span>
          <span>{program.priceDisplay}</span>
        </div>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-foreground mb-6">
        Payment
      </h2>

      {/* Square card container */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground block mb-3">
          Card Details
        </label>
        <div
          id="sq-card-container"
          className={`min-h-[100px] rounded-lg border border-border bg-secondary p-3 transition-opacity ${
            cardReady ? "opacity-100" : "opacity-0"
          }`}
        />
        {!cardReady && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading secure payment form…
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mb-6">
        Payments are processed securely by Square. AscendIQ never stores your card details.
      </p>

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-destructive mb-4">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} className="h-12 px-6" disabled={status === "loading"}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={handlePay}
          disabled={!cardReady || status === "loading"}
          className="h-12 px-8 flex-1 sm:flex-none"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              Pay {program.priceDisplay}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// ─── Success ───────────────────────────────────────────────────────────────
function SuccessView({
  program,
  paymentId,
  receiptUrl,
}: {
  program: Program
  paymentId: string
  receiptUrl?: string
}) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-9 w-9 text-primary" />
      </div>
      <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground mb-3">
        You&apos;re enrolled!
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-2">
        <strong className="text-foreground">{program.name}</strong> · {program.startDate}
      </p>
      <p className="text-muted-foreground text-sm mb-8">
        A confirmation email is on its way. We&apos;ll reach out within 24 hours with next steps.
      </p>

      <div className="inline-block text-left bg-card border border-border rounded-lg px-6 py-4 mb-8 text-sm">
        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Payment ID</div>
        <div className="font-mono text-foreground">{paymentId}</div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {receiptUrl && (
          <Button asChild variant="outline">
            <a href={receiptUrl} target="_blank" rel="noopener noreferrer">
              View Receipt
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
        <Button asChild>
          <Link href="/programs">Explore Other Programs</Link>
        </Button>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function EnrollPage() {
  const [step, setStep] = useState<Step>(1)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [info, setInfo] = useState({ name: "", email: "", phone: "", studentName: "" })
  const [result, setResult] = useState<{ paymentId: string; receiptUrl?: string } | null>(null)

  const handleInfoChange = (key: string, value: string) =>
    setInfo((prev) => ({ ...prev, [key]: value }))

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">
            Enrollment
          </p>

          {!result && <StepIndicator current={step} />}

          {result && selectedProgram ? (
            <SuccessView
              program={selectedProgram}
              paymentId={result.paymentId}
              receiptUrl={result.receiptUrl}
            />
          ) : step === 1 ? (
            <ProgramStep
              selected={selectedProgram}
              onSelect={setSelectedProgram}
              onNext={() => setStep(2)}
            />
          ) : step === 2 && selectedProgram ? (
            <InfoStep
              program={selectedProgram}
              info={info}
              onChange={handleInfoChange}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          ) : step === 3 && selectedProgram ? (
            <PaymentStep
              program={selectedProgram}
              info={info}
              onBack={() => setStep(2)}
              onSuccess={(paymentId, receiptUrl) => setResult({ paymentId, receiptUrl })}
            />
          ) : null}
        </div>
      </section>

      <Footer />
    </main>
  )
}

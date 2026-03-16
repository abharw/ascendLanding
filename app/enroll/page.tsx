"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight, ArrowLeft, Check, CheckCircle, Loader2, AlertCircle, ExternalLink } from "lucide-react"

// ─── Program data (replace with CMS / DB later) ───────────────────────────
// ⚠️ REMOVE TEST_PROGRAM after confirming Square works end-to-end
const TEST_PROGRAM = {
  id: "test-payment",
  phase: "TEST",
  name: "⚠️ Test Payment – $0.01",
  cohort: "Dev Only",
  startDate: "N/A",
  duration: "N/A",
  ageRange: "N/A",
  spotsLeft: 99,
  price: 1, // 1 cent
  priceDisplay: "$0.01",
  description: "Remove this after confirming Square is working. Charges exactly $0.01 and runs through the full enrollment flow.",
  comingSoon: false,
}

const PROGRAMS = [
  TEST_PROGRAM,
  {
    id: "ascendiq-bootcamp",
    phase: "DISCOVER",
    name: "Summer Startup Lab",
    cohort: "Summer 2026",
    startDate: "Summer 2026",
    duration: "6 weeks · Daily sessions",
    ageRange: "Ages 13–15",
    spotsLeft: 15,
    price: 149500, // $1,495 limited-time in cents
    priceOriginal: 299500, // $2,995 regular
    priceDisplay: "$1,495",
    priceOriginalDisplay: "$2,995",
    description:
      "A hands-on summer cohort for students ages 13–15. Explore entrepreneurship, prototype a real idea, and present at demo day. The DISCOVER stage—where it all begins.",
    comingSoon: false,
  },
  {
    id: "startup-lab",
    phase: "BUILD",
    name: "Entrepreneurship Training",
    cohort: "Spring 2026",
    startDate: "March 15, 2026",
    duration: "12 weeks · 2 sessions/week",
    ageRange: "Ages 16–18",
    spotsLeft: 8,
    price: 49900,
    priceDisplay: "$499",
    description:
      "Ongoing mentorship from ideation to launch. Ship a real product or service, practice your pitch, and deliver a portfolio-ready case study at demo day.",
    comingSoon: true,
  },
  {
    id: "skills-internships",
    phase: "WORK",
    name: "Apprenticeship Skill Building",
    cohort: "Spring 2026",
    startDate: "April 1, 2026",
    duration: "8–16 weeks · Project-based",
    ageRange: "Ages 18–22",
    spotsLeft: 12,
    price: 39900,
    priceDisplay: "$399",
    description:
      "Learn in-demand skills and earn your way into the workforce. Complete the program and get hired by a partner employer—or use what you built to launch your own venture.",
    comingSoon: true,
  },
  {
    id: "career-training",
    phase: "LAUNCH",
    name: "Mentoring & Coaching",
    cohort: "Rolling Enrollment",
    startDate: "Flexible start date",
    duration: "6 months · 1:1 mentorship",
    ageRange: "Ages 18–25",
    spotsLeft: 5,
    price: 59900,
    priceDisplay: "$599",
    description:
      "Structured transition from training to high-impact employment. Paired with a mentor from your target industry, plus career mapping and interview prep.",
    comingSoon: true,
  },
  {
    id: "flex-bundle",
    phase: "BUNDLE",
    name: "AscendIQ Flex Bundle",
    cohort: "Spring 2026",
    startDate: "Flexible",
    duration: "Choose 2–3 programs",
    ageRange: "Varies by selection",
    spotsLeft: 10,
    price: 149900,
    priceDisplay: "From $1,499",
    description:
      "Select any 2 or 3 programs and save $100. Build the right combination across Summer Startup Lab, Entrepreneurship Training, Apprenticeship Skill Building, and Mentoring & Coaching.",
    comingSoon: false,
    isFlexBundle: true as const,
  },
]

type Step = 1 | 2 | 3
type Program = (typeof PROGRAMS)[number]

export type EnrollInfo = {
  parentFirstName: string
  parentLastName: string
  email: string
  signUpForNews: boolean
  country: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipCode: string
  grade: string
  studentFirstName: string
  studentLastName: string
  studentEmail: string
  studentPhone: string
  highSchoolAttending: string
}

const DEFAULT_ENROLL_INFO: EnrollInfo = {
  parentFirstName: "",
  parentLastName: "",
  email: "",
  signUpForNews: false,
  country: "United States",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  grade: "",
  studentFirstName: "",
  studentLastName: "",
  studentEmail: "",
  studentPhone: "",
  highSchoolAttending: "",
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming", "District of Columbia",
]

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
const REGULAR_PROGRAMS = PROGRAMS.filter((p) => !("isFlexBundle" in p && p.isFlexBundle))

function ProgramStep({
  selected,
  onSelect,
  onNext,
  bundleSelections,
  onBundleChange,
}: {
  selected: Program | null
  onSelect: (p: Program) => void
  onNext: () => void
  bundleSelections: string[]
  onBundleChange: (ids: string[]) => void
}) {
  // Compute bundle price live
  const bundleItems = REGULAR_PROGRAMS.filter((p) => bundleSelections.includes(p.id))
  const bundleRawCents = bundleItems.reduce((sum, p) => sum + p.price, 0) - 10000
  const bundleCents = Math.max(149900, bundleRawCents)
  const bundlePriceDisplay = `$${(bundleCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`

  const canContinue = !!selected && (!("isFlexBundle" in selected && selected.isFlexBundle) || bundleSelections.length >= 2)

  return (
    <div>
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground text-balance leading-tight mb-3">
        Open Enrollment
      </h1>
      <p className="text-muted-foreground mb-10">
        Select a program to enroll. All programs include mentorship, curriculum, and portfolio support.
      </p>

      <div className="space-y-4 mb-10">
        {PROGRAMS.map((program) => {
          const isFlexBundle = "isFlexBundle" in program && program.isFlexBundle
          return (
            <button
              key={program.id}
              type="button"
              onClick={() => !program.comingSoon && onSelect(program)}
              disabled={program.comingSoon}
              className={`w-full text-left rounded-lg border p-6 transition-all duration-200 ${
                program.comingSoon
                  ? "border-border bg-muted/50 cursor-not-allowed opacity-75"
                  : selected?.id === program.id
                  ? "border-primary bg-primary/[0.04] ring-1 ring-primary/30"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h2 className="font-semibold text-foreground">{program.name}</h2>
                    <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {"phase" in program ? program.phase : ""}
                    </span>
                    {program.comingSoon ? (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground/70">
                        {program.cohort}
                      </span>
                    )}
                    {!program.comingSoon && program.spotsLeft <= 5 && (
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
                  {"priceOriginalDisplay" in program && program.priceOriginalDisplay ? (
                    <>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="font-bold text-xl text-muted-foreground line-through">
                          {program.priceOriginalDisplay}
                        </span>
                        <span className="font-bold text-2xl text-primary">{program.priceDisplay}</span>
                      </div>
                      <div className="text-xs text-primary font-medium">Limited-time price</div>
                    </>
                  ) : isFlexBundle && selected?.id === "flex-bundle" && bundleSelections.length >= 2 ? (
                    <>
                      <div className="font-bold text-2xl text-primary">{bundlePriceDisplay}</div>
                      <div className="text-xs text-primary font-medium">save $100</div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-2xl text-foreground">{program.priceDisplay}</div>
                      <div className="text-xs text-muted-foreground">per student</div>
                    </>
                  )}
                </div>
              </div>

              {/* Flex Bundle sub-program selector */}
              {isFlexBundle && selected?.id === "flex-bundle" && (
                <div
                  className="mt-4 pt-4 border-t border-border"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Select 2–3 programs to bundle
                  </p>
                  <div className="space-y-3">
                    {REGULAR_PROGRAMS.map((p) => {
                      const checked = bundleSelections.includes(p.id)
                      const atMax = bundleSelections.length >= 3 && !checked
                      return (
                        <label
                          key={p.id}
                          className={`flex items-center justify-between gap-4 ${atMax ? "opacity-40" : "cursor-pointer"}`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={checked}
                              disabled={atMax}
                              onCheckedChange={(v) => {
                                if (v) onBundleChange([...bundleSelections, p.id])
                                else onBundleChange(bundleSelections.filter((id) => id !== p.id))
                              }}
                            />
                            <span className="text-sm text-foreground">{p.name}</span>
                            <span className="text-xs font-bold text-muted-foreground">{"phase" in p ? p.phase : ""}</span>
                          </div>
                          <span className="text-sm font-medium text-foreground shrink-0">{p.priceDisplay}</span>
                        </label>
                      )
                    })}
                  </div>
                  {bundleSelections.length >= 2 ? (
                    <div className="mt-4 pt-3 border-t border-border flex justify-between text-sm font-semibold">
                      <span className="text-foreground">
                        Bundle total{" "}
                        <span className="font-normal text-muted-foreground text-xs">(save $100)</span>
                      </span>
                      <span className="text-primary">{bundlePriceDisplay}</span>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-muted-foreground">Select at least 2 programs to continue.</p>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <Button
        size="lg"
        disabled={!canContinue}
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
  onCheckboxChange,
  onBack,
  onNext,
}: {
  program: Program
  info: EnrollInfo
  onChange: (key: keyof EnrollInfo, value: string) => void
  onCheckboxChange: (key: keyof EnrollInfo, value: boolean) => void
  onBack: () => void
  onNext: () => void
}) {
  const valid =
    info.parentFirstName.trim() &&
    info.parentLastName.trim() &&
    info.email.trim() &&
    info.addressLine1.trim() &&
    info.city.trim() &&
    info.state.trim() &&
    info.zipCode.trim() &&
    info.grade &&
    info.studentFirstName.trim() &&
    info.studentLastName.trim() &&
    info.highSchoolAttending.trim()

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
        High School Program Registration
      </h2>

      <div className="space-y-8 mb-10">
        <div>
          <p className="text-sm font-semibold text-foreground mb-4">Name of Parent / Guardian</p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="parentFirstName" className="text-sm font-medium text-foreground">
                First Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="parentFirstName"
                placeholder="Jane"
                required
                value={info.parentFirstName}
                onChange={(e) => onChange("parentFirstName", e.target.value)}
                className="h-12 bg-secondary border-border text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="parentLastName" className="text-sm font-medium text-foreground">
                Last Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="parentLastName"
                placeholder="Smith"
                required
                value={info.parentLastName}
                onChange={(e) => onChange("parentLastName", e.target.value)}
                className="h-12 bg-secondary border-border text-base"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email <span className="text-destructive">*</span>
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

        <div className="flex items-center gap-2">
          <Checkbox
            id="signUpForNews"
            checked={info.signUpForNews}
            onCheckedChange={(checked) => onCheckboxChange("signUpForNews", checked === true)}
          />
          <label htmlFor="signUpForNews" className="text-sm font-medium text-foreground cursor-pointer">
            Sign up for news and updates
          </label>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground mb-4">Address</p>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium text-foreground">Country <span className="text-destructive">*</span></label>
              <Input
                id="country"
                placeholder="United States"
                value={info.country}
                onChange={(e) => onChange("country", e.target.value)}
                className="h-12 bg-secondary border-border text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="addressLine1" className="text-sm font-medium text-foreground">Address Line 1 <span className="text-destructive">*</span></label>
              <Input
                id="addressLine1"
                placeholder="123 Main St"
                required
                value={info.addressLine1}
                onChange={(e) => onChange("addressLine1", e.target.value)}
                className="h-12 bg-secondary border-border text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="addressLine2" className="text-sm font-medium text-foreground">Address Line 2 (optional)</label>
              <Input
                id="addressLine2"
                placeholder="Apt 4"
                value={info.addressLine2}
                onChange={(e) => onChange("addressLine2", e.target.value)}
                className="h-12 bg-secondary border-border text-base"
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium text-foreground">City <span className="text-destructive">*</span></label>
                <Input
                  id="city"
                  placeholder="Boston"
                  required
                  value={info.city}
                  onChange={(e) => onChange("city", e.target.value)}
                  className="h-12 bg-secondary border-border text-base"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium text-foreground">State <span className="text-destructive">*</span></label>
                <Select value={info.state} onValueChange={(v) => onChange("state", v)}>
                  <SelectTrigger className="h-12 w-full bg-secondary border-border text-base">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="zipCode" className="text-sm font-medium text-foreground">ZIP Code <span className="text-destructive">*</span></label>
                <Input
                  id="zipCode"
                  placeholder="02101"
                  required
                  value={info.zipCode}
                  onChange={(e) => onChange("zipCode", e.target.value)}
                  className="h-12 bg-secondary border-border text-base"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="grade" className="text-sm font-medium text-foreground">
            Most Recent Grade Completed <span className="text-destructive">*</span>
          </label>
          <Select value={info.grade} onValueChange={(v) => onChange("grade", v)}>
            <SelectTrigger className="h-12 w-full bg-secondary border-border text-base">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8th">8th</SelectItem>
              <SelectItem value="9th">9th</SelectItem>
              <SelectItem value="10th">10th</SelectItem>
              <SelectItem value="11th">11th</SelectItem>
              <SelectItem value="12th">12th</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground mb-4">Student Name</p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="studentFirstName" className="text-sm font-medium text-foreground">
                First Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="studentFirstName"
                placeholder="Alex"
                required
                value={info.studentFirstName}
                onChange={(e) => onChange("studentFirstName", e.target.value)}
                className="h-12 bg-secondary border-border text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="studentLastName" className="text-sm font-medium text-foreground">
                Last Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="studentLastName"
                placeholder="Smith"
                required
                value={info.studentLastName}
                onChange={(e) => onChange("studentLastName", e.target.value)}
                className="h-12 bg-secondary border-border text-base"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <label htmlFor="studentEmail" className="text-sm font-medium text-foreground">Student Email (optional)</label>
              <Input
                id="studentEmail"
                type="email"
                placeholder="alex@email.com"
                value={info.studentEmail}
                onChange={(e) => onChange("studentEmail", e.target.value)}
                className="h-12 bg-secondary border-border text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="studentPhone" className="text-sm font-medium text-foreground">Student Phone (optional)</label>
              <Input
                id="studentPhone"
                type="tel"
                placeholder="(555) 000-0000"
                value={info.studentPhone}
                onChange={(e) => onChange("studentPhone", e.target.value)}
                className="h-12 bg-secondary border-border text-base"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="highSchoolAttending" className="text-sm font-medium text-foreground">
            High School Attending <span className="text-destructive">*</span>
          </label>
          <Input
            id="highSchoolAttending"
            placeholder="City High School"
            required
            value={info.highSchoolAttending}
            onChange={(e) => onChange("highSchoolAttending", e.target.value)}
            className="h-12 bg-secondary border-border text-base"
          />
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
  info: EnrollInfo
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
          name: `${info.parentFirstName} ${info.parentLastName}`.trim(),
          email: info.email,
          phone: info.studentPhone || "",
          studentPhone: info.studentPhone,
          studentName: `${info.studentFirstName} ${info.studentLastName}`.trim(),
          parentFirstName: info.parentFirstName,
          parentLastName: info.parentLastName,
          signUpForNews: info.signUpForNews,
          country: info.country,
          addressLine1: info.addressLine1,
          addressLine2: info.addressLine2,
          city: info.city,
          state: info.state,
          zipCode: info.zipCode,
          grade: info.grade,
          studentFirstName: info.studentFirstName,
          studentLastName: info.studentLastName,
          studentEmail: info.studentEmail,
          studentPhone: info.studentPhone,
          highSchoolAttending: info.highSchoolAttending,
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
          <span className="font-medium text-foreground">{`${info.studentFirstName} ${info.studentLastName}`.trim() || `${info.parentFirstName} ${info.parentLastName}`.trim()}</span>
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
  const [bundleSelections, setBundleSelections] = useState<string[]>([])
  const [info, setInfo] = useState<EnrollInfo>(DEFAULT_ENROLL_INFO)
  const [result, setResult] = useState<{ paymentId: string; receiptUrl?: string } | null>(null)

  const handleInfoChange = (key: keyof EnrollInfo, value: string) =>
    setInfo((prev) => ({ ...prev, [key]: value }))

  const handleCheckboxChange = (key: keyof EnrollInfo, value: boolean) =>
    setInfo((prev) => ({ ...prev, [key]: value }))

  // For flex bundle: compute resolved price and display name
  const effectiveProgram = (() => {
    if (!selectedProgram || !("isFlexBundle" in selectedProgram && selectedProgram.isFlexBundle)) {
      return selectedProgram
    }
    if (bundleSelections.length < 2) return selectedProgram
    const items = REGULAR_PROGRAMS.filter((p) => bundleSelections.includes(p.id))
    const rawCents = items.reduce((sum, p) => sum + p.price, 0) - 10000
    const price = Math.max(149900, rawCents)
    const priceDisplay = `$${(price / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`
    const name = `Flex Bundle: ${items.map((p) => p.name).join(" + ")}`
    return { ...selectedProgram, price, priceDisplay, name }
  })()

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">
            Enrollment
          </p>

          {!result && <StepIndicator current={step} />}

          {result && effectiveProgram ? (
            <SuccessView
              program={effectiveProgram}
              paymentId={result.paymentId}
              receiptUrl={result.receiptUrl}
            />
          ) : step === 1 ? (
            <ProgramStep
              selected={selectedProgram}
              onSelect={(p) => {
                setSelectedProgram(p)
                if (!("isFlexBundle" in p && p.isFlexBundle)) setBundleSelections([])
              }}
              onNext={() => setStep(2)}
              bundleSelections={bundleSelections}
              onBundleChange={setBundleSelections}
            />
          ) : step === 2 && effectiveProgram ? (
            <InfoStep
              program={effectiveProgram}
              info={info}
              onChange={handleInfoChange}
              onCheckboxChange={handleCheckboxChange}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          ) : step === 3 && effectiveProgram ? (
            <PaymentStep
              program={effectiveProgram}
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

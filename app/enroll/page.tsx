"use client"

import { useState, useRef, useEffect } from "react"
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
import {
  Check,
  CheckCircle,
  CircleNotch,
  WarningCircle,
  ShoppingCart,
} from "@phosphor-icons/react"

// ─── Program data ──────────────────────────────────────────────────────────
const PROGRAMS = [
  {
    id: "ascendiq-bootcamp",
    phase: "DISCOVER",
    name: "Summer Startup Lab",
    cohort: "Summer 2026",
    startDate: "July 7, 2026",
    duration: "6 weeks · Daily sessions",
    ageRange: "Ages 13–15",
    spotsLeft: 15,
    price: 149500,
    priceOriginal: 299500,
    priceDisplay: "$1,495",
    priceOriginalDisplay: "$2,995",
    description:
      "A hands-on summer cohort for students ages 13–15. Explore entrepreneurship, prototype a real idea, and present at demo day. The DISCOVER stage—where it all begins.",
    comingSoon: false,
    isBundle: false,
  },
  {
    id: "startup-lab",
    phase: "BUILD",
    name: "Entrepreneurship Training",
    cohort: "Summer 2026",
    startDate: "June 1, 2026",
    duration: "12 weeks · 2 sessions/week",
    ageRange: "Ages 16–18",
    spotsLeft: 8,
    price: 49900,
    priceDisplay: "$499",
    description:
      "Ongoing mentorship from ideation to launch. Ship a real product or service, practice your pitch, and deliver a portfolio-ready case study at demo day.",
    comingSoon: true,
    isBundle: false,
  },
  {
    id: "skills-internships",
    phase: "WORK",
    name: "Apprenticeship Skill Building",
    cohort: "Summer 2026",
    startDate: "June 1, 2026",
    duration: "8–16 weeks · Project-based",
    ageRange: "Ages 18–22",
    spotsLeft: 12,
    price: 39900,
    priceDisplay: "$399",
    description:
      "Learn in-demand skills and earn your way into the workforce. Complete the program and get hired by a partner employer—or use what you built to launch your own venture.",
    comingSoon: true,
    isBundle: false,
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
    price: 300000,
    priceDisplay: "$3,000",
    description:
      "Structured transition from training to high-impact employment. Paired with a mentor from your target industry, plus career mapping and interview prep.",
    comingSoon: true,
    isBundle: false,
  },
]

const BUNDLE_PROGRAMS = PROGRAMS

type Step = 1 | 2 | 3
type SelectionMode = "individual" | "bundle"

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

// ─── Helpers ───────────────────────────────────────────────────────────────
function formatCents(cents: number) {
  const dollars = cents / 100
  return dollars % 1 === 0 ? `$${dollars.toLocaleString()}` : `$${dollars.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
}

// ─── Step indicator ────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  const steps = ["Choose Programs", "Your Info", "Payment"]
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
              {done ? <Check className="size-3.5" /> : n}
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

// ─── Cart summary strip ────────────────────────────────────────────────────
function CartSummary({
  mode,
  cartItems,
  bundleSelections,
}: {
  mode: SelectionMode | null
  cartItems: string[]
  bundleSelections: string[]
}) {
  const items =
    mode === "bundle"
      ? BUNDLE_PROGRAMS.filter((p) => bundleSelections.includes(p.id))
      : PROGRAMS.filter((p) => cartItems.includes(p.id))

  if (items.length === 0) return null

  const total = items.length

  return (
    <div className="mt-8 rounded-lg border border-primary/30 bg-primary/[0.03] p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="size-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Cart ({total} {total === 1 ? "item" : "items"})
        </span>
      </div>
      <ul className="space-y-2">
        {items.map((p) => (
          <li key={p.id} className="flex items-center justify-between text-sm">
            <span className="text-foreground">{p.name}</span>
            <span className="text-primary font-medium tabular-nums">{p.priceDisplay}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm font-semibold">
        <span className="text-foreground">Total</span>
        <span className="text-primary">{formatCents(items.reduce((sum, p) => sum + p.price, 0))}</span>
      </div>
    </div>
  )
}

// ─── Step 1: Program selection (cart model) ────────────────────────────────
function ProgramStep({
  mode,
  cartItems,
  bundleSelections,
  onToggleItem,
  onBundleToggle,
  onBundleSelectionChange,
  onNext,
}: {
  mode: SelectionMode | null
  cartItems: string[]
  bundleSelections: string[]
  onToggleItem: (id: string) => void
  onBundleToggle: () => void
  onBundleSelectionChange: (ids: string[]) => void
  onNext: () => void
}) {
  const canContinue =
    (mode === "individual" && cartItems.length > 0) ||
    (mode === "bundle" && bundleSelections.length >= 2)

  const individualPrograms = PROGRAMS.filter((p) => !p.isBundle)

  return (
    <div>
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground text-balance leading-tight mb-3">
        Open Enrollment
      </h1>
      <p className="text-muted-foreground mb-10">
        Add programs to your cart, or choose the Flex Bundle to mix and match.
      </p>

      {/* Individual programs */}
      <div className="space-y-3 mb-6">
        {individualPrograms.map((program) => {
          const inCart = cartItems.includes(program.id)

          return (
            <div
              key={program.id}
              className={`rounded-lg border p-5 transition-all duration-200 ${
                program.comingSoon
                  ? "border-border bg-muted/50 opacity-60"
                  : inCart
                  ? "border-primary bg-primary/[0.04] ring-1 ring-primary/30"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="font-semibold text-foreground text-sm">{program.name}</h2>
                    <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {program.phase}
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
                  <p className="text-xs text-muted-foreground mb-2">{program.description}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span>📅 {program.startDate}</span>
                    <span>⏱ {program.duration}</span>
                    <span>👤 {program.ageRange}</span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  {"priceOriginalDisplay" in program && program.priceOriginalDisplay ? (
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-sm text-muted-foreground line-through">{program.priceOriginalDisplay}</span>
                        <span className="font-bold text-lg text-primary">{program.priceDisplay}</span>
                      </div>
                      <div className="text-xs text-primary font-medium">Limited-time</div>
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className="font-bold text-lg text-foreground">{program.priceDisplay}</div>
                      <div className="text-xs text-muted-foreground">per student</div>
                    </div>
                  )}

                  {!program.comingSoon && (
                    <Button
                      size="sm"
                      variant={inCart ? "default" : "outline"}
                      onClick={() => onToggleItem(program.id)}
                      className="text-xs h-8 px-3 shrink-0"
                    >
                      {inCart ? (
                        <>
                          <Check className="mr-1 size-3" />
                          In Cart
                        </>
                      ) : (
                        "Add to Cart"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Flex Bundle card */}
      <div
        className={`rounded-lg border p-5 transition-all duration-200 cursor-pointer ${
          mode === "bundle"
            ? "border-primary bg-primary/[0.04] ring-1 ring-primary/30"
            : "border-border bg-card hover:border-primary/30"
        }`}
        onClick={onBundleToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="font-semibold text-foreground text-sm">AscendIQ Flex Bundle</h2>
              <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                BUNDLE
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground/70">
                Spring 2026
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Select any 2 or 3 programs and save $100. Build the right combination across our full program suite.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-bold text-lg text-foreground">From $1,499</div>
            <div className="text-xs text-muted-foreground">per student</div>
          </div>
        </div>

        {/* Bundle sub-selector — only shown when bundle mode is active */}
        {mode === "bundle" && (
          <div
            className="mt-4 pt-4 border-t border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Select 2–3 programs to bundle
            </p>
            <div className="space-y-3">
              {BUNDLE_PROGRAMS.map((p) => {
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
                          if (v) onBundleSelectionChange([...bundleSelections, p.id])
                          else onBundleSelectionChange(bundleSelections.filter((id) => id !== p.id))
                        }}
                      />
                      <span className="text-sm text-foreground">{p.name}</span>
                      <span className="text-xs font-bold text-muted-foreground">{p.phase}</span>
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
                <span className="text-primary">
                  ${(Math.max(
                    149900,
                    bundleSelections.reduce((s, id) => s + (BUNDLE_PROGRAMS.find((p) => p.id === id)?.price ?? 0), 0) - 10000
                  ) / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}
                </span>
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">Select at least 2 programs to continue.</p>
            )}
          </div>
        )}
      </div>

      {/* Cart summary */}
      <CartSummary mode={mode} cartItems={cartItems} bundleSelections={bundleSelections} />

      <div className="mt-8">
        <Button
          size="lg"
          disabled={!canContinue}
          onClick={onNext}
          className="w-full sm:w-auto h-12 px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

// ─── Step 2: Contact / student info ───────────────────────────────────────
function InfoStep({
  mode,
  cartItems,
  bundleSelections,
  info,
  onChange,
  onCheckboxChange,
  onBack,
  onNext,
}: {
  mode: SelectionMode
  cartItems: string[]
  bundleSelections: string[]
  info: EnrollInfo
  onChange: (key: keyof EnrollInfo, value: string) => void
  onCheckboxChange: (key: keyof EnrollInfo, value: boolean) => void
  onBack: () => void
  onNext: () => void
}) {
  const items =
    mode === "bundle"
      ? BUNDLE_PROGRAMS.filter((p) => bundleSelections.includes(p.id))
      : PROGRAMS.filter((p) => cartItems.includes(p.id))

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
      {/* Cart summary header */}
      <div className="rounded-lg border border-border bg-card px-5 py-4 mb-10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium text-foreground text-sm">
            {mode === "bundle" ? "Flex Bundle" : `Cart · ${items.length} program${items.length !== 1 ? "s" : ""}`}
          </div>
          <div className="text-xs text-primary font-medium">
            {formatCents(items.reduce((sum, p) => sum + p.price, 0))}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {items.map((p) => p.name).join(" · ")}
        </div>
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
          Back
        </Button>
        <Button size="lg" disabled={!valid} onClick={onNext} className="h-12 px-8">
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}

// ─── Step 3: Payment ────────────────────────────────────────────────────────
type SquareCard = {
  attach: (selector: string) => Promise<void>
  tokenize: () => Promise<{ token?: string; errors?: Array<{ message: string }> }>
  destroy?: () => void
}

function PaymentStep({
  mode,
  cartItems,
  bundleSelections,
  info,
  onBack,
  onSuccess,
}: {
  mode: SelectionMode
  cartItems: string[]
  bundleSelections: string[]
  info: EnrollInfo
  onBack: () => void
  onSuccess: (paymentId: string, receiptUrl?: string) => void
}) {
  const [formStatus, setFormStatus] = useState<"initializing" | "ready" | "processing" | "load-error">("initializing")
  const [paymentError, setPaymentError] = useState("")
  const cardRef = useRef<SquareCard | null>(null)

  const items =
    mode === "bundle"
      ? BUNDLE_PROGRAMS.filter((p) => bundleSelections.includes(p.id))
      : PROGRAMS.filter((p) => cartItems.includes(p.id))

  const totalCents = items.reduce((sum, p) => sum + p.price, 0)

  useEffect(() => {
    let destroyed = false
    let card: SquareCard | null = null

    async function initCard() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sq = (window as any).Square
      if (!sq || destroyed) return
      try {
        const payments = sq.payments(
          process.env.NEXT_PUBLIC_SQUARE_APP_ID,
          process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
        )
        card = await payments.card()
        if (destroyed) { card.destroy?.(); return }
        await card.attach("#square-card-container")
        cardRef.current = card
        setFormStatus("ready")
      } catch {
        if (!destroyed) setFormStatus("load-error")
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Square) {
      initCard()
    } else {
      const src = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production"
        ? "https://web.squarecdn.com/v1/square.js"
        : "https://sandbox.web.squarecdn.com/v1/square.js"
      const script = document.createElement("script")
      script.src = src
      script.onload = initCard
      script.onerror = () => { if (!destroyed) setFormStatus("load-error") }
      document.head.appendChild(script)
    }

    return () => {
      destroyed = true
      card?.destroy?.()
      cardRef.current = null
    }
  }, [])

  const handlePay = async () => {
    if (!cardRef.current || formStatus !== "ready") return
    setFormStatus("processing")
    setPaymentError("")

    try {
      const result = await cardRef.current.tokenize()
      if (!result.token) {
        setPaymentError(result.errors?.[0]?.message ?? "Please check your card details and try again.")
        setFormStatus("ready")
        return
      }

      const programId = mode === "bundle" ? "flex-bundle" : "cart"
      const programName = mode === "bundle"
        ? `Flex Bundle: ${items.map((p) => p.name).join(", ")}`
        : items.map((p) => p.name).join(", ")

      const res = await fetch("/api/enroll/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: result.token,
          programId,
          programName,
          bundleSelections: mode === "bundle" ? bundleSelections : [],
          cartItems: mode === "individual" ? cartItems : [],
          name: `${info.parentFirstName} ${info.parentLastName}`.trim(),
          email: info.email,
          phone: info.studentPhone || "",
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
      setPaymentError(err instanceof Error ? err.message : "Payment failed. Please try again.")
      setFormStatus("ready")
    }
  }

  return (
    <div>
      {/* Order summary */}
      <div className="rounded-lg border border-border bg-card px-5 py-4 mb-10 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          {mode === "bundle" ? "Flex Bundle" : "Cart"}
        </div>
        {items.map((p) => (
          <div key={p.id} className="flex items-center justify-between text-sm">
            <span className="text-foreground">{p.name}</span>
            <span className="text-primary font-medium">{p.priceDisplay}</span>
          </div>
        ))}
        <div className="border-t border-border pt-3 mt-3 flex justify-between text-sm">
          <span className="text-muted-foreground">Enrolling</span>
          <span className="font-medium text-foreground">
            {`${info.studentFirstName} ${info.studentLastName}`.trim() || `${info.parentFirstName} ${info.parentLastName}`.trim()}
          </span>
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span>Total</span>
          <span className="text-primary">{formatCents(totalCents)}</span>
        </div>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-foreground mb-6">
        Payment
      </h2>

      {/* Square embedded card form */}
      <div className="mb-2">
        {formStatus === "initializing" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground h-14">
            <CircleNotch className="h-4 w-4 animate-spin shrink-0" />
            Loading secure payment form…
          </div>
        )}
        {formStatus === "load-error" && (
          <div className="flex items-center gap-2 text-sm text-destructive h-14">
            <WarningCircle className="size-4 shrink-0" />
            Failed to load payment form. Please refresh the page.
          </div>
        )}
        <div
          id="square-card-container"
          className={formStatus === "initializing" || formStatus === "load-error" ? "hidden" : ""}
        />
      </div>

      {paymentError && (
        <div className="flex items-center gap-2 text-sm text-destructive mb-4">
          <WarningCircle className="size-4 shrink-0" />
          {paymentError}
        </div>
      )}

      <p className="text-xs text-muted-foreground mb-6">
        Your payment is processed securely by Square. We never store your card details.
      </p>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={formStatus === "processing"}
          className="h-12 px-6"
        >
          Back
        </Button>
        <Button
          size="lg"
          onClick={handlePay}
          disabled={formStatus !== "ready"}
          className="h-12 px-8 flex-1 sm:flex-none"
        >
          {formStatus === "processing" ? (
            <>
              <CircleNotch className="mr-2 size-4 animate-spin" />
              Processing…
            </>
          ) : (
            `Pay ${formatCents(totalCents)}`
          )}
        </Button>
      </div>
    </div>
  )
}

// ─── Success ───────────────────────────────────────────────────────────────
function SuccessView({
  enrolledNames,
  paymentId,
  receiptUrl,
}: {
  enrolledNames: string
  paymentId: string
  receiptUrl?: string
}) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="size-9 text-primary" />
      </div>
      <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground mb-3">
        You&apos;re enrolled!
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-2">
        <strong className="text-foreground">{enrolledNames}</strong>
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
  const [mode, setMode] = useState<SelectionMode | null>(null)
  const [cartItems, setCartItems] = useState<string[]>([])
  const [bundleSelections, setBundleSelections] = useState<string[]>([])
  const [info, setInfo] = useState<EnrollInfo>(DEFAULT_ENROLL_INFO)
  const [result, setResult] = useState<{ paymentId: string; receiptUrl?: string } | null>(null)

  const handleInfoChange = (key: keyof EnrollInfo, value: string) =>
    setInfo((prev) => ({ ...prev, [key]: value }))
  const handleCheckboxChange = (key: keyof EnrollInfo, value: boolean) =>
    setInfo((prev) => ({ ...prev, [key]: value }))

  // Toggle individual program in/out of cart. Switches to individual mode.
  const handleToggleItem = (id: string) => {
    setMode("individual")
    setBundleSelections([]) // clear bundle when switching to individual
    setCartItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // Activate/deactivate bundle mode (mutually exclusive with individual cart)
  const handleBundleToggle = () => {
    if (mode === "bundle") {
      setMode(null)
      setBundleSelections([])
    } else {
      setMode("bundle")
      setCartItems([]) // clear individual cart when switching to bundle
    }
  }

  const enrolledNames = (() => {
    const items =
      mode === "bundle"
        ? BUNDLE_PROGRAMS.filter((p) => bundleSelections.includes(p.id))
        : PROGRAMS.filter((p) => cartItems.includes(p.id))
    return items.map((p) => p.name).join(", ")
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

          {result ? (
            <SuccessView
              enrolledNames={enrolledNames}
              paymentId={result.paymentId}
              receiptUrl={result.receiptUrl}
            />
          ) : step === 1 ? (
            <ProgramStep
              mode={mode}
              cartItems={cartItems}
              bundleSelections={bundleSelections}
              onToggleItem={handleToggleItem}
              onBundleToggle={handleBundleToggle}
              onBundleSelectionChange={(ids) => setBundleSelections(ids)}
              onNext={() => setStep(2)}
            />
          ) : step === 2 && mode ? (
            <InfoStep
              mode={mode}
              cartItems={cartItems}
              bundleSelections={bundleSelections}
              info={info}
              onChange={handleInfoChange}
              onCheckboxChange={handleCheckboxChange}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          ) : step === 3 && mode ? (
            <PaymentStep
              mode={mode}
              cartItems={cartItems}
              bundleSelections={bundleSelections}
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

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import CountUp from "@/components/CountUp"

const stats = [
  { value: 53, suffix: "%", label: "Of college grads are underemployed a year after graduation" },
  { value: 40, suffix: "%", label: "Of employers say new grads lack soft skills" },
]

export function CtaStrip() {
  return (
    <section className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
          Why This Matters
        </p>
        <div className="flex flex-wrap justify-center gap-8 lg:gap-16 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-bold text-3xl lg:text-4xl text-primary">
                <CountUp to={stat.value} duration={1.5} />
                {stat.suffix}
              </div>
              <p className="mt-1 text-sm text-muted-foreground max-w-xs">{stat.label}</p>
            </div>
          ))}
        </div>
        <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground text-balance">
          Ready to get started?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Don&apos;t let your student graduate with theory and no proof they can execute. We&apos;ll connect you with the right program or partnership within 24 hours.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="h-12 px-8 text-base font-medium">
            <Link href="/programs">
              Explore Programs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base font-medium">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import BlurText from "@/components/BlurText"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-24 lg:py-32 text-center relative z-10">
        <div
          role="heading"
          aria-level={1}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance leading-[1.05]"
        >
          <BlurText
            text="Preparing Workers for the AI-Enabled Economy."
            animateBy="words"
            direction="top"
            delay={80}
            className="justify-center"
            sessionKey="hero-animated"
          />
        </div>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Real projects, real mentorship, and proven apprenticeship pathways—for schools, families, and employers.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild className="h-12 px-8 text-base shadow-lg shadow-primary/20 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Link href="/programs">
              Explore Programs
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base font-medium transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Link href="#who-we-serve">Who We Serve</Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

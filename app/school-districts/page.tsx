"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap, FileCheck } from "lucide-react"
import AnimatedContent from "@/components/AnimatedContent"

export default function SchoolDistrictsPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <article className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={30} duration={0.6}>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">
              For School Districts
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground text-balance leading-tight">
              Custom Contracts. Custom Pricing.
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Bring AscendIQ&apos;s workforce readiness programs to your district. We work with schools on custom contracts—pricing is discussed individually based on scale, goals, and partnership structure.
            </p>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={40} delay={0.2} duration={0.6}>
            <div className="mt-16 grid sm:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-foreground mb-2">What You Get</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Turnkey apprenticeship pathways, technical assistance, and curriculum—no need to build from scratch. We align with federal workforce development standards.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-foreground mb-2">Next Steps</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Reach out to discuss your district&apos;s needs. We&apos;ll review scale, timeline, and funding options—and propose a partnership that fits.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={30} delay={0.3} duration={0.6}>
            <div className="mt-16 pt-12 border-t border-border text-center">
              <p className="text-muted-foreground mb-6">
                Ready to bring workforce readiness to your district?
              </p>
              <Button asChild size="lg">
                <Link href="/contact?audience=school">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimatedContent>
        </div>
      </article>

      <Footer />
    </main>
  )
}

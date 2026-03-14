import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaStrip() {
  return (
    <section className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground text-balance">
          Ready to get started?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          We&apos;ll connect you with the right program or partnership within 24 hours.
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

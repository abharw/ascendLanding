import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Target, FileCheck, Building2 } from "lucide-react"
import AnimatedContent from "@/components/AnimatedContent"

export default function ImpactPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <article className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={30} duration={0.6}>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">
              Our Impact
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground text-balance leading-tight">
              Outcomes That Align With Government Funding Priorities
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
              AscendIQ&apos;s programs are designed to meet federal workforce development standards and align with initiatives like the Horizon Fund—turning investment into measurable career outcomes for American workers.
            </p>
          </AnimatedContent>

          <div className="mt-20 space-y-16">
            <AnimatedContent direction="vertical" distance={40} delay={0.1} duration={0.6}>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-foreground mb-4">
                    What We Do
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We deliver workforce readiness through three pathways: entrepreneurship training, technical proficiency and apprenticeships, and pathways to good-paying roles. Each program combines hands-on learning, mentorship from industry operators, and portfolio-building—equipping workers for the technology-enabled economy.
                  </p>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent direction="vertical" distance={40} delay={0.2} duration={0.6}>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-foreground mb-4">
                    Horizon Fund & Government Alignment
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Our work is aligned with federal workforce development initiatives, including pathways that qualify for Horizon Fund and similar government funding programs. We partner with schools, workforce boards, and community organizations to deliver equitable access to high-impact training.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary font-medium">•</span>
                      Meets federal apprenticeship pathway standards
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-medium">•</span>
                      Aligned with workforce development goals
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-medium">•</span>
                      Community-focused, sustainable career trajectories
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent direction="vertical" distance={40} delay={0.3} duration={0.6}>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-foreground mb-4">
                    Partner With Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Schools, workforce boards, and community development organizations: we can help you access funding and deliver proven outcomes. Reach out to discuss alignment and partnership.
                  </p>
                  <Button asChild>
                    <Link href="/contact?audience=school">
                      Get in Touch
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}

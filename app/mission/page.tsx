"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Envelope } from "@phosphor-icons/react"
import AnimatedContent from "@/components/AnimatedContent"
import BlurText from "@/components/BlurText"

export default function MissionPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <article className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={30} duration={0.6}>
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-6">
              Our Mission
            </p>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground text-balance leading-tight">
              <BlurText
                text="The Generation the AI Economy Can't Afford to Lose."
                animateBy="words"
                direction="top"
                delay={80}
                className="block"
              />
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Workforce readiness through apprenticeship pathways, technical assistance, and industry partnerships.
            </p>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={40} delay={0.2} duration={0.6}>
            <section className="mt-16 space-y-8">
              <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-foreground">
                The AI revolution and young people
              </h2>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Two major challenges are emerging from the AI revolution: work displacement as automation reshapes industries, and infrastructure pressure from the massive energy demands of AI. But there is another group we must pay attention to.
                </p>
                <p>
                  Young people. The highest economic casualty of AI advancement. They are entering the workforce just as entry-level jobs are shrinking and traditional career pathways are being disrupted. If we are not intentional, young people may become the largest casualties of the AI transition.
                </p>
                <p>
                  That is why we built AscendIQ: to turn learning into real economic capability. We prepare American workers for success through proven apprenticeship models, technical proficiency, and industry partnerships—building a sustainable workforce for the AI-enabled economy.
                </p>
                <p>
                  AscendIQ is focused on: workforce readiness programs, applied skills development, apprenticeships, entrepreneurship training, and pathways to good-paying roles. We center workers as part of the solution, with equitable access and community development at the core.
                </p>
                <p>
                  We sell to schools and parents who want to upskill their kids. We run startup labs, skills training, and career programs. Schools partner with us for turnkey curriculum. Parents enroll their kids. Mentors join to give back. We deliver real mentorship, real projects, real outcomes — career-ready when traditional pathways aren&apos;t.
                </p>
              </div>
            </section>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={40} delay={0.3} duration={0.6}>
            <section className="mt-16">
              <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-foreground mb-8">
                Here is how we develop builders:
              </h2>
              
              <ul className="space-y-8">
                <li>
                  <h3 className="font-medium text-foreground text-lg">Technical proficiency & apprenticeships</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    Real projects. Real mentorship. Proven models that prepare workers for the technology-enabled economy. The skills that matter — initiative, execution, judgment — with pathways to good-paying roles.
                  </p>
                </li>
                <li>
                  <h3 className="font-medium text-foreground text-lg">Startup + career pathways</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    Build real ventures. Learn by doing. Industry partnerships and technical assistance that lead to lasting careers. Workforce readiness that benefits communities and meets the needs of working people.
                  </p>
                </li>
                <li>
                  <h3 className="font-medium text-foreground text-lg">Partnership with schools & communities</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    We provide curriculum and mentorship so schools don&apos;t have to build from scratch. Community-focused development. Be the partner that prepares workers for what&apos;s next.
                  </p>
                </li>
              </ul>
            </section>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={40} delay={0.4} duration={0.6}>
            <p className="mt-16 text-xl text-foreground leading-relaxed">
              For parents and schools, AscendIQ reduces the risk of young people being left behind in the AI transition. We turn learning into real economic capability. We build future builders — for an economy that demands more than a diploma.
            </p>

            <p className="mt-8 text-2xl font-serif text-foreground">
              The technology-enabled economy needs workers prepared to lead—through sustainable pathways, industry partnership, and community development.
            </p>

            <div className="mt-20 pt-16 border-t border-border flex flex-col sm:flex-row gap-8 sm:gap-12">
              <Link href="/team">
                <Button variant="outline" className="border-border hover:bg-secondary">
                  Meet the Team
                </Button>
              </Link>
              <Button asChild variant="outline" className="border-border hover:bg-secondary">
                <a href="mailto:info@ascendiq.com">
                  <Envelope className="mr-2 size-4" />
                  info@ascendiq.com
                </a>
              </Button>
              <Link 
                href="/contact" 
                className="text-sm font-medium text-primary hover:underline self-center"
              >
                Get in touch
              </Link>
            </div>
          </AnimatedContent>
        </div>
      </article>

      <Footer />
    </main>
  )
}

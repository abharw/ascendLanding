"use client"

import Link from "next/link"
import AnimatedContent from "@/components/AnimatedContent"
import { Button } from "@/components/ui/button"

const pillars = [
  {
    number: "01",
    id: "startup-lab",
    title: "Entrepreneurship Training",
    description: "Move beyond theory by building and launching real ventures. We cultivate the high-leverage skills—execution, initiative, and problem-solving—that remain quintessentially human in the age of automation.",
  },
  {
    number: "02",
    id: "skills-internships",
    title: "Technical Proficiency & Apprenticeships",
    description: "Gain hands-on expertise through industry apprenticeships and technical assistance. We use proven models to prepare workers for roles in the technology-enabled economy—with curriculum and mentorship that lead to lasting careers.",
  },
  {
    number: "03",
    id: "career-training",
    title: "Pathways to Good-Paying Roles",
    description: "Structured transition from training to high-impact employment. Our pathways connect workers with industry partners and veteran operators—designed for long-term career success and community development.",
  },
]

export function PillarsSection() {
  return (
    <section id="programs" className="py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            Our Programs
          </p>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground text-balance">
            Workforce Readiness. Proven Models. Real Outcomes.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Our programs deliver equitable access to high-impact training—combining 
            apprenticeship pathways, technical proficiency, and industry partnerships 
            for sustainable career trajectories.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical connecting line */}
          <div className="absolute left-8 md:left-[3.25rem] top-10 bottom-10 w-px bg-border hidden md:block" />

          <div className="space-y-12">
            {pillars.map((pillar, index) => (
              <AnimatedContent direction="vertical" distance={20} duration={0.4} delay={index * 0.15} key={pillar.id}>
                <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                  
                  {/* Number Node */}
                  <div className="w-16 h-16 rounded-2xl bg-background border-2 border-primary/20 shadow-sm flex items-center justify-center shrink-0 relative z-10 md:ml-5">
                    <span className="text-2xl font-bold text-primary">{pillar.number}</span>
                  </div>
                  
                  {/* Content Card */}
                  <div className="flex-1 bg-background border border-border shadow-sm rounded-xl p-8 lg:p-10 transition-all hover:border-primary/30 w-full group">
                    <h3 className="font-semibold text-2xl lg:text-3xl text-foreground leading-snug mb-4 group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed text-lg mb-8 max-w-2xl">
                      {pillar.description}
                    </p>
                    
                    <Button asChild variant="outline" className="w-full sm:w-auto shadow-sm hover:ring-2 hover:ring-primary/20 hover:-translate-y-0.5 transition-all">
                      <Link href={`/programs#${pillar.id}`}>
                        Learn more & register
                      </Link>
                    </Button>
                  </div>

                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

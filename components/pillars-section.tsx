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
    <section id="programs" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-20">
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

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => (
            <AnimatedContent
              key={pillar.number}
              direction="vertical"
              distance={40}
              delay={index * 0.15}
              duration={0.6}
              className="h-full"
            >
            <div
              className="group relative bg-background border border-border rounded-lg p-8 lg:p-10 hover:border-foreground/20 transition-all duration-300 h-full"
            >
              <div className="mb-6">
                <span className="font-bold tracking-tight text-5xl lg:text-6xl text-muted-foreground/30 group-hover:text-primary/60 transition-colors">
                  {pillar.number}
                </span>
              </div>
              
              <h3 className="font-semibold tracking-tight text-xl lg:text-2xl text-foreground mb-4">
                {pillar.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
              <Link href={`/programs#${pillar.id}`} className="mt-6 inline-flex">
                <Button variant="outline" size="sm" className="group/btn">
                  Learn more & register
                </Button>
              </Link>
            </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap, Users, Building2 } from "lucide-react"
import AnimatedContent from "@/components/AnimatedContent"

const audiences = [
  {
    icon: GraduationCap,
    label: "For Schools",
    headline: "Bring workforce readiness to your students — no curriculum to build.",
    bullets: [
      "Turnkey apprenticeship pathways, ready to implement",
      "Technical assistance and educator support included",
      "Meets federal workforce development standards",
    ],
    cta: "Partner With Us",
    href: "/contact?audience=school",
  },
  {
    icon: Users,
    label: "For Parents",
    headline: "Give your student a real edge before graduation.",
    bullets: [
      "Portfolio-ready skills employers actually want",
      "Apprenticeship and internship matching",
      "Cohort-based programs, ages 13–24",
    ],
    cta: "Enroll Your Student",
    href: "/enroll",
  },
  {
    icon: Building2,
    label: "For Employers",
    headline: "Build your talent pipeline through proven apprenticeship.",
    bullets: [
      "Vetted, trained candidates ready to contribute",
      "Aligned with federal apprenticeship pathways",
      "Flexible partnership — hiring, mentorship, or both",
    ],
    cta: "Explore Partnership",
    href: "/contact?audience=employer",
  },
]

export function WhoWeServeSection() {
  return (
    <section id="who-we-serve" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            Who We Serve
          </p>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground text-balance">
            Built for Schools, Families, and Industry.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Whether you're a school looking for turnkey curriculum, a parent investing
            in your student's future, or an employer building a talent pipeline — we
            have a clear path for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {audiences.map((audience, index) => (
            <AnimatedContent
              key={audience.label}
              direction="vertical"
              distance={40}
              delay={index * 0.12}
              duration={0.6}
              className="h-full"
            >
              <div className="flex flex-col bg-background border border-border rounded-lg p-8 lg:p-10 h-full hover:border-primary/30 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <audience.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                    {audience.label}
                  </span>
                </div>

                <h3 className="font-semibold text-xl text-foreground leading-snug mb-5">
                  {audience.headline}
                </h3>

                <ul className="space-y-3 mb-8 flex-1">
                  {audience.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>

                <Button asChild variant="outline" className="w-full group">
                  <Link href={audience.href}>
                    {audience.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  )
}

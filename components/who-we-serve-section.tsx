"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Buildings } from "@phosphor-icons/react"
import AnimatedContent from "@/components/AnimatedContent"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const audiences = [
  {
    icon: Users,
    label: "For Parents",
    headline: "Give your student a real edge before graduation.",
    bullets: [
      "Concrete, job-ready skills employers actually look for",
      "Apprenticeship and internship matching",
      "Cohort-based programs, ages 13–24",
    ],
    cta: "Enroll Your Student",
    href: "/enroll",
  },
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
    icon: Buildings,
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
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            Who We Serve
          </p>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground text-balance">
            Built for Schools, Families, and Industry.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Whether you&apos;re a school looking for turnkey curriculum, a parent investing
            in your student&apos;s future, or an employer building a talent pipeline — we
            have a clear path for you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue={audiences[0].label} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto gap-2 p-1 bg-muted/50 mb-8 rounded-lg">
              {audiences.map((audience) => (
                <TabsTrigger 
                  key={audience.label} 
                  value={audience.label}
                  className="py-3 text-base md:text-sm lg:text-base data-[state=active]:shadow-sm rounded-md"
                >
                  <audience.icon className="w-5 h-5 mr-2" />
                  {audience.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {audiences.map((audience) => (
              <TabsContent key={audience.label} value={audience.label} className="outline-none">
                <AnimatedContent direction="vertical" distance={20} duration={0.4}>
                  <div className="flex flex-col md:flex-row bg-background border border-border shadow-sm rounded-xl p-8 lg:p-12 gap-8 items-center lg:items-start transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <audience.icon className="h-8 w-8 text-primary" />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-semibold text-2xl lg:text-3xl text-foreground leading-snug mb-6">
                        {audience.headline}
                      </h3>
                      
                      <ul className="space-y-4 mb-8 text-left">
                        {audience.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-3 text-base text-muted-foreground">
                            <span className="mt-2 w-2 h-2 rounded-full bg-primary/80 shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      
                      <Button asChild size="lg" className="w-full md:w-auto shadow-sm hover:ring-2 hover:ring-primary/20 hover:-translate-y-0.5 transition-all">
                        <Link href={audience.href}>
                          {audience.cta}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </AnimatedContent>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  )
}

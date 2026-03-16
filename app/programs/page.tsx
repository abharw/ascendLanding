"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import AnimatedContent from "@/components/AnimatedContent"
import { Check } from "lucide-react"

const accordionTriggerClass =
  "py-6 text-left hover:no-underline [&[data-state=open]>svg]:rotate-180"

const programs = [
  {
    id: "ascendiq-bootcamp",
    number: "01",
    phase: "DISCOVER",
    title: "Summer Startup Lab",
    tagline: "Explore ideas. Build something real.",
    description: "A structured summer experience for young students to discover entrepreneurship through hands-on projects. Students ideate, prototype, and present a real idea—building curiosity, confidence, and foundational skills before high school ends.",
    details: {
      duration: "6-week summer program",
      format: "Cohort-based, daily sessions",
      ageRange: "Ages 13–15",
      whatIncluded: [
        "Introduction to entrepreneurship and design thinking",
        "Team-based ideation and prototype building",
        "Peer collaboration and presentation skills",
        "Demo day with real feedback from mentors",
      ],
      outcomes: [
        "Confidence to explore and act on ideas",
        "Early exposure to entrepreneurial thinking",
        "A project to build on in future programs",
      ],
    },
  },
  {
    id: "startup-lab",
    number: "02",
    phase: "BUILD",
    title: "Entrepreneurship Training",
    tagline: "Build real products. Launch real ventures.",
    description: "Young people learn by doing — initiative, execution, problem-solving. The skills that AI can't replace. Help your student prove they can build and deliver real projects—not just talk about ideas.",
    details: {
      duration: "12-week program",
      format: "Cohort-based, 2 sessions/week",
      ageRange: "Ages 16–18",
      whatIncluded: [
        "Ideation to MVP — ship a real product or service",
        "Mentorship from operators who've built and scaled",
        "Pitch practice and demo day with real feedback",
        "Portfolio-ready case study and presentation",
      ],
      outcomes: [
        "Proof they can execute, not just theorize",
        "Initiative, judgment, and resilience — skills AI can't replicate",
        "A real venture or project to talk about in interviews",
      ],
    },
  },
  {
    id: "skills-internships",
    number: "03",
    phase: "WORK",
    title: "Apprenticeship Skill Building",
    tagline: "Learn in-demand skills. Get hired or build your own venture.",
    description: "Pay upfront for in-demand skills that open doors. Complete the program and either get hired by our partner employers or use the skills to build your own business. Businesses: contact us directly for business-sized contracts.",
    details: {
      duration: "8–16 weeks",
      format: "Project-based learning + optional internship placement",
      ageRange: "Ages 18–22",
      whatIncluded: [
        "Technical and soft skills: collaboration, communication, time management",
        "Real project work that goes in a portfolio",
        "Internship matching with vetted partners",
        "Career coaching and resume review",
      ],
      outcomes: [
        "Portfolio that stands out when entry-level roles are scarce",
        "Professional habits employers actually look for",
        "Direct path to internship and early-career opportunities",
      ],
    },
  },
  {
    id: "career-training",
    number: "04",
    phase: "LAUNCH",
    title: "Mentoring & Coaching",
    tagline: "Structured transition from training to high-impact employment.",
    description: "Our pathways connect workers with industry partners and veteran operators—designed for long-term career success and community development. Career readiness that meets the needs of working people.",
    details: {
      duration: "Ongoing, 6-month minimum recommended",
      format: "1:1 mentorship + group workshops",
      ageRange: "Ages 18–25",
      whatIncluded: [
        "Paired with a mentor from your target industry",
        "Career mapping and goal-setting sessions",
        "Interview prep and networking practice",
        "LinkedIn and personal brand optimization",
      ],
      outcomes: [
        "Clear path from school to first real role",
        "Network and relationships that open doors",
        "Confidence and readiness when opportunities appear",
      ],
    },
  },
]

export default function ProgramsPage() {
  const [openValue, setOpenValue] = useState<string>("")

  // Expand section from URL hash on load (e.g. /programs#startup-lab)
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash && programs.some((p) => p.id === hash)) {
      setOpenValue(hash)
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Header />
      
      <article className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={30} duration={0.6}>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">
              Our Programs
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground text-balance leading-tight">
              Workforce Readiness. Proven Models. Real Outcomes.
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
              AscendIQ prepares American workers for the technology-enabled economy through apprenticeship pathways, technical proficiency, and industry partnerships. We deliver equitable access to high-impact training—entrepreneurship, applied skills, and pathways to good-paying roles—building sustainable career trajectories for all communities.
            </p>
          </AnimatedContent>

          <div className="mt-16 lg:mt-20">
            <Accordion
              type="single"
              collapsible
              value={openValue}
              onValueChange={setOpenValue}
              className="programs-accordion space-y-6"
            >
              {programs.map((program, index) => {
                return (
                  <div
                    key={program.id}
                    data-accordion-id={program.id}
                  >
                    <AnimatedContent
                      direction="vertical"
                      distance={30}
                      delay={index * 0.1}
                      duration={0.6}
                    >
                      <AccordionItem
                        id={program.id}
                        value={program.id}
                        className="rounded-lg border border-border bg-card px-6 data-[state=open]:border-primary/40 data-[state=open]:bg-primary/[0.03] transition-colors scroll-mt-24"
                      >
                    <AccordionTrigger className={accordionTriggerClass}>
                      <div className="flex items-start gap-4 w-full">
                        <span className="font-bold tracking-tight text-4xl text-muted-foreground/40 shrink-0">
                          {program.number}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h2 className="font-semibold text-xl sm:text-2xl text-foreground">
                              {program.title}
                            </h2>
                            <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {program.phase}
                            </span>
                          </div>
                          <p className="text-primary font-medium text-sm mt-1">
                            {program.tagline}
                          </p>
                          <p className="text-muted-foreground mt-3 text-base hidden sm:block">
                            {program.description}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 [--tw-duration:0.5s]">
                      <p className="text-muted-foreground sm:hidden mb-6">{program.description}</p>
                      
                      <div className="grid sm:grid-cols-2 gap-8 lg:gap-12 text-sm">
                        <div>
                          <p className="font-medium text-foreground mb-4">What&apos;s included</p>
                          <ul className="space-y-2">
                            {program.details.whatIncluded.map((item, i) => (
                              <li key={i} className="flex gap-2 text-muted-foreground">
                                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-4">Outcomes</p>
                          <ul className="space-y-2">
                            {program.details.outcomes.map((item, i) => (
                              <li key={i} className="flex gap-2 text-muted-foreground">
                                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-4 items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                          <span className="font-medium text-foreground">{program.details.duration}</span>
                          {" · "}
                          {program.details.format}
                          {" · "}
                          {program.details.ageRange}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {program.id === "career-training" ? (
                            <>
                              <Button asChild>
                                <Link href="/enroll?program=career-training">
                                  For Parents – Sign Up Your Student
                                </Link>
                              </Button>
                              <Button asChild variant="outline">
                                <Link href="/contact?audience=school&program=pathways">
                                  For Schools – Reach Out Directly
                                </Link>
                              </Button>
                            </>
                          ) : program.id === "skills-internships" ? (
                            <>
                              <Button asChild>
                                <Link href="/enroll?program=skills-internships">
                                  Enroll Now
                                </Link>
                              </Button>
                              <Button asChild variant="outline">
                                <Link href="/contact?audience=employer">
                                  For Businesses – Contact for Contracts
                                </Link>
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button asChild>
                                <Link href={`/enroll`}>
                                  Enroll Now
                                </Link>
                              </Button>
                              <Button asChild variant="outline">
                                <Link href="/contact">
                                  Inquire / Ask a Question
                                </Link>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </AnimatedContent>
              </div>
                );
              })}
            </Accordion>
          </div>

          <AnimatedContent direction="vertical" distance={30} delay={0.3} duration={0.6}>
            <div className="mt-16 pt-12 border-t border-border">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Also available</p>
              <div className="rounded-lg border border-border bg-card px-6 py-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">AscendIQ Flex Bundle</h3>
                  <p className="text-sm text-muted-foreground mt-1">Combine 2–3 programs and save $100. Build the right pathway for your student.</p>
                </div>
                <Button asChild>
                  <Link href="/enroll">View Bundle Options</Link>
                </Button>
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={30} delay={0.4} duration={0.6}>
            <div className="mt-20 pt-16 border-t border-border text-center">
              <p className="text-muted-foreground mb-6">
                Not sure which program fits? Schools, industry, or community development partnerships?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/community">Ways to Engage</Link>
                </Button>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </article>

      <Footer />
    </main>
  )
}

"use client"

import AnimatedContent from "@/components/AnimatedContent"
import { AlertTriangle } from "lucide-react"

const problems = [
  "Classroom learning is too academic—students rarely get hands-on experience that translates to real jobs.",
  "Young people lack entrepreneurial skills and business acumen—they don't know how to turn ideas into action.",
  "Networking is underused—most students never learn the power of relationships and professional connections.",
  "Structured bureaucracies are foreign—they need to learn how to operate within organizations and systems.",
]

export function ProblemsSection() {
  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            The Gap We Fill
          </p>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground text-balance">
            The Educational Ecosystem Has a Problem.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Before we built AscendIQ, we looked at what&apos;s broken—and designed our programs to fix it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <AnimatedContent
              key={index}
              direction="vertical"
              distance={30}
              delay={index * 0.1}
              duration={0.6}
              className="h-full"
            >
              <div className="flex gap-4 p-6 rounded-lg border border-border bg-background">
                <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-muted-foreground leading-relaxed">{problem}</p>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  )
}

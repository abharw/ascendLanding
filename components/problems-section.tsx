"use client"

import AnimatedContent from "@/components/AnimatedContent"
import { Warning } from "@phosphor-icons/react"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"

const problems = [
  "Classroom learning is too academic—students rarely get hands-on experience that translates to real jobs.",
  "Young people lack entrepreneurial skills and business acumen—they don't know how to turn ideas into action.",
  "Networking is underused—most students never learn the power of relationships and professional connections.",
  "Structured bureaucracies are foreign—they need to learn how to operate within organizations and systems.",
]

export function ProblemsSection() {
  return (
    <section className="py-24 lg:py-32 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <AnimatedContent direction="horizontal" distance={-40} duration={0.6}>
            <div className="max-w-lg lg:pr-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
                The Gap We Fill
              </p>
              <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground text-balance mb-6">
                The Educational Ecosystem Has a Problem.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Before we built AscendIQ, we looked at what&apos;s broken in traditional models—and we explicitly designed our apprenticeship and training pathways to fix it. We don&apos;t just teach theory; we execute.
              </p>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="horizontal" distance={40} duration={0.6} delay={0.2}>
            <div className="bg-muted/40 p-8 lg:p-10 rounded-2xl border border-border shadow-sm">
              <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
                <Warning className="w-6 h-6 text-amber-500" weight="fill" />
                Current Shortfalls
              </h3>
              <ul className="space-y-6">
                {problems.map((problem, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                      <span className="text-destructive font-bold text-xs">✕</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                      {problem}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedContent>

        </div>
      </div>
    </section>
  )
}

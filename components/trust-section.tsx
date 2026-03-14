"use client"

import { Quote } from "lucide-react"
import AnimatedContent from "@/components/AnimatedContent"

const testimonials = [
  {
    quote: "We brought AscendIQ into our school. Parents are asking for it by name. Our students have a real edge — and we didn't have to build the curriculum from scratch.",
    author: "Dr. Lisa Chen",
    role: "Director of Career Readiness",
    organization: "Charter School Network",
  },
  {
    quote: "My daughter wasn't getting internships. After AscendIQ, she had a portfolio and skills employers actually want. Worth every penny — and the worry is gone.",
    author: "Maria Torres",
    role: "Parent",
    organization: "AscendIQ Family",
  },
]

const sectors = [
  "K–12 Schools",
  "Charter Networks",
  "Community Programs",
  "Industry Partners",
  "After-School Programs",
  "Workforce Boards",
]

export function TrustSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            Proven Outcomes
          </p>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground text-balance">
            Partners in Workforce Development. Communities See Results.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            We work with schools, families, and industry to deliver workforce readiness
            that meets the needs of working people—one partnership at a time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <AnimatedContent
              key={index}
              direction="vertical"
              distance={50}
              delay={index * 0.2}
              duration={0.6}
              className="h-full"
            >
              <div className="relative bg-card border border-border rounded-lg p-8 lg:p-10 h-full">
                <Quote className="h-10 w-10 text-primary/30 mb-6" />

                <blockquote className="text-lg text-foreground leading-relaxed mb-8">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold tracking-tight text-primary">
                      {testimonial.author.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground/70">{testimonial.organization}</div>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>

        {/* Partner sectors */}
        <div className="mt-20 pt-16 border-t border-border">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-8">
            Serving Schools, Families & Community Partners
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {sectors.map((sector) => (
              <div
                key={sector}
                className="rounded-md border border-border px-4 py-3 text-sm font-medium text-muted-foreground text-center bg-card"
              >
                {sector}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

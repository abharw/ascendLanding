"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Medal, Lightning } from "@phosphor-icons/react"
import AnimatedContent from "@/components/AnimatedContent"

const tiers = [
  {
    name: "Silver",
    price: "$5,000",
    highlights: [
      "Logo placement on AscendIQ materials",
      "Recognition in program communications",
      "Connection with student cohorts",
    ],
  },
  {
    name: "Gold",
    price: "$12,500",
    highlights: [
      "All Silver benefits",
      "Featured product/service promotion to students",
      "Direct introductions to top cohort graduates",
      "Quarterly impact report",
    ],
  },
  {
    name: "Platinum",
    price: "$25,000",
    highlights: [
      "All Gold benefits",
      "Premier visibility across all AscendIQ channels",
      "Exclusive access to talent pipeline",
      "Annual sponsor summit",
      "Co-branded case studies and testimonials",
    ],
  },
]

export default function SponsorPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <article className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={30} duration={0.6}>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Medal className="size-6 text-primary" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">
              Join as a Sponsor
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground text-balance leading-tight">
              Invest in the Next Generation
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
              Align your brand with workforce readiness. Push your products, connect with students, and build lasting impact. Sponsorship tiers from $5k to $25k.
            </p>
          </AnimatedContent>

          <div className="mt-16 lg:mt-20 grid md:grid-cols-3 gap-6 lg:gap-8">
            {tiers.map((tier, index) => (
              <AnimatedContent
                key={tier.name}
                direction="vertical"
                distance={30}
                delay={index * 0.1}
                duration={0.6}
                className="h-full"
              >
                <div className="flex flex-col h-full rounded-lg border border-border bg-card p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightning className="size-5 text-primary" />
                    <span className="font-semibold text-lg text-foreground">{tier.name}</span>
                  </div>
                  <div className="font-bold text-2xl text-primary mb-6">{tier.price}</div>
                  <ul className="space-y-3 flex-1">
                    {tier.highlights.map((h) => (
                      <li key={h} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary shrink-0">•</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" className="mt-6 w-full">
                    <Link href="/contact?audience=sponsor">
                      Inquire
                    </Link>
                  </Button>
                </div>
              </AnimatedContent>
            ))}
          </div>

          <AnimatedContent direction="vertical" distance={30} delay={0.4} duration={0.6}>
            <div className="mt-16 pt-12 border-t border-border text-center">
              <p className="text-muted-foreground mb-6">
                Custom partnership levels available. Let&apos;s discuss what works for you.
              </p>
              <Button asChild size="lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </AnimatedContent>
        </div>
      </article>

      <Footer />
    </main>
  )
}

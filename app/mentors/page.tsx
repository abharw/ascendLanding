"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users } from "lucide-react"
import AnimatedContent from "@/components/AnimatedContent"

export default function MentorsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <article className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={30} duration={0.6}>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">Mentors</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground text-balance leading-tight">
              Mentor the Next Generation
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              We pair students with industry operators à la carte. Share your expertise, give back, and be recognized as someone who builds future builders.
            </p>
          </AnimatedContent>
          <AnimatedContent direction="vertical" distance={40} delay={0.2} duration={0.6}>
            <div className="mt-16 p-6 rounded-lg border border-border bg-card">
              <h2 className="font-semibold text-lg text-foreground mb-4">How It Works</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Mentors are matched with students based on industry, goals, and availability. You decide your commitment level—from one-off sessions to ongoing guidance. We handle the matching and logistics.
              </p>
              <Button asChild>
                <Link href="/contact?audience=mentor">
                  Become a Mentor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimatedContent>
        </div>
      </article>
      <Footer />
    </main>
  )
}

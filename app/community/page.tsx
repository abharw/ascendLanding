"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, GraduationCap, Building2 } from "lucide-react"
import AnimatedContent from "@/components/AnimatedContent"

const engagementTypes = [
  { icon: GraduationCap, title: "Enroll a Student", desc: "Parents: Give your student access to apprenticeship pathways and real-world skills.", href: "/enroll", label: "Enroll" },
  { icon: Users, title: "Join the Community", desc: "Connect with other families, mentors, and partners invested in workforce readiness.", href: "/contact", label: "Get in Touch" },
  { icon: Building2, title: "Partner With Us", desc: "Schools and employers: Bring AscendIQ to your organization.", href: "/contact?audience=school", label: "Partner" },
]

export default function CommunityPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <article className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={30} duration={0.6}>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">Ways to Engage</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground text-balance leading-tight">
              Join the AscendIQ Community
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
              Whether you&apos;re a parent, school, employer, or mentor—there&apos;s a place for you. Choose how you want to engage.
            </p>
          </AnimatedContent>
          <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8">
            {engagementTypes.map((item, i) => (
              <AnimatedContent key={item.title} direction="vertical" distance={30} delay={i * 0.1} duration={0.6}>
                <div className="flex flex-col h-full rounded-lg border border-border bg-card p-6 lg:p-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="font-semibold text-lg text-foreground mb-2">{item.title}</h2>
                  <p className="text-muted-foreground text-sm flex-1">{item.desc}</p>
                  <Button asChild variant="outline" className="mt-6 w-full">
                    <Link href={item.href}>{item.label} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </main>
  )
}

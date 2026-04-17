"use client"

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
import { Check, ArrowLeft } from "@phosphor-icons/react"

const sessions = [
  {
    id: "session-1",
    number: "01",
    title: "AI Foundations & Your First Workflows",
    duration: "2 hours · Live Zoom + screen share + guided exercises",
    objectives: [
      "Understand what AI actually is (and isn't) — explained in plain, everyday language",
      "Navigate ChatGPT, Claude, and Gemini — know which tool fits which task",
      "Write effective prompts that get useful, specific results on the first try",
      "Use AI to draft professional emails, memos, and messages in seconds",
      "Learn how to fact-check AI outputs and avoid common mistakes",
    ],
    exercise: {
      title: "Prompt Lab",
      body: "Participants draft 5 real prompts for their own work scenarios and refine them live with instructor feedback.",
    },
  },
  {
    id: "session-2",
    number: "02",
    title: "AI for Content, Communication & Productivity",
    duration: "2 hours · Live Zoom + screen share + guided exercises",
    objectives: [
      "Create professional slide presentations using AI (Google Slides, Canva, PowerPoint + Copilot)",
      "Use AI to work smarter in Excel and Google Sheets — formulas, data cleanup, charts, and summaries",
      "Edit documents, photos, and videos with AI-powered tools (grammar checkers, background removers, auto-captions)",
      "Generate and edit images with AI tools (Canva AI, DALL-E, Midjourney basics)",
      "Automate repetitive tasks: meeting notes, email summaries, scheduling, data entry",
    ],
    exercise: {
      title: "Productivity Sprint",
      body: "Each participant builds a 5-slide presentation and a formatted spreadsheet using AI — start to finish in 25 minutes.",
    },
  },
  {
    id: "session-3",
    number: "03",
    title: "AI for Your Career, Business & Beyond",
    duration: "2 hours · Live Zoom + screen share + guided exercises",
    objectives: [
      "Use AI for job searching, resume optimization, cover letters, and interview prep",
      "Explore AI tools for small business: invoicing, customer service bots, social media scheduling",
      "Learn AI-assisted writing and editing — blog posts, social captions, professional bios",
      "Understand AI ethics, privacy, and what NOT to share with AI tools",
      "Build a personalized 'AI Toolkit' — a curated list of tools matched to your goals",
    ],
    exercise: {
      title: "My AI Toolkit",
      body: "Participants leave with a written, personalized action plan — their top 5 AI tools, use cases, and a 30-day challenge to integrate them.",
    },
  },
]

const whatsIncluded = [
  "6 hours of live, instructor-led Zoom instruction",
  "All session recordings (90-day post-course access)",
  "Downloadable resource guide PDF — tool links, prompt templates, cheat sheets",
  "Personalized AI Toolkit template (fillable PDF / Google Doc)",
  "Certificate of completion",
  "Q&A and chat support throughout each session",
]

const whoItsFor = [
  { title: "Working adults", body: "Professionals who need AI to fit into their actual workday — not a CS degree." },
  { title: "Career changers", body: "Anyone re-entering or shifting careers who wants AI fluency on their resume." },
  { title: "Small business owners", body: "Operators looking to save hours on email, content, scheduling, and admin." },
  { title: "Parents", body: "Adults who want to keep up with the tools their kids and coworkers are already using." },
]

const faqs = [
  {
    q: "Do I need any tech experience?",
    a: "No. This course is built for complete novices. If you can use email and a web browser, you're ready.",
  },
  {
    q: "Will I get the recordings?",
    a: "Yes. Every session is recorded and posted to your participant portal. You'll have 90 days of access after the course ends.",
  },
  {
    q: "What tools or software do I need?",
    a: "A laptop or desktop, a stable internet connection, and a free Zoom account. We'll guide you through any AI tools we use during the sessions — most are free or have free tiers.",
  },
  {
    q: "What's the refund policy?",
    a: "Full refund up to 7 days before the first session. After that, you can transfer your seat to a later cohort.",
  },
  {
    q: "Are there discounts available?",
    a: "Yes — early-bird seats are $349 (first 10 in each cohort) and group rates of $349/person are available for 3+ enrollees from the same organization.",
  },
]

export default function AIToolkitAdultsPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <article className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={30} duration={0.6}>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="size-4" />
              Back to all programs
            </Link>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">
              Curriculum · AI Toolkit for Everyone
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground text-balance leading-tight">
              Learn AI by doing — not by watching.
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
              A practical, no-jargon introduction to the AI tools reshaping how we work, create, and communicate. Across three live Zoom sessions, you build real slides, real spreadsheets, real documents — guided by a live instructor every step of the way.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/enroll?program=ai-toolkit-everyone">Enroll Now – $399</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                <Link href="/contact?program=ai-toolkit-everyone">Ask a Question</Link>
              </Button>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={30} delay={0.15} duration={0.6}>
            <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Format", value: "Live Zoom" },
                { label: "Sessions", value: "3 × 2 hours" },
                { label: "Total time", value: "6 hours" },
                { label: "Price", value: "$399" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border bg-card px-4 py-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 font-semibold text-lg text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={30} delay={0.2} duration={0.6}>
            <section className="mt-20">
              <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
                Session breakdown
              </h2>
              <p className="mt-3 text-muted-foreground max-w-2xl">
                Three live, hands-on sessions. No theory lectures — just usable skills you can apply the same week.
              </p>

              <div className="mt-10 space-y-6">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-lg border border-border bg-card px-5 sm:px-7 py-7"
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-bold tracking-tight text-2xl sm:text-4xl text-muted-foreground/40 shrink-0">
                        {session.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xl sm:text-2xl text-foreground">
                          {session.title}
                        </h3>
                        <p className="text-primary font-medium text-sm mt-1">{session.duration}</p>

                        <p className="font-medium text-foreground mt-6 mb-3 text-sm">Learning objectives</p>
                        <ul className="space-y-2 text-sm">
                          {session.objectives.map((item, i) => (
                            <li key={i} className="flex gap-2 text-muted-foreground">
                              <Check className="size-4 text-primary shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6 rounded-md bg-primary/[0.05] border border-primary/20 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                            Hands-on exercise · {session.exercise.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{session.exercise.body}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={30} delay={0.25} duration={0.6}>
            <section className="mt-20">
              <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
                What&apos;s included
              </h2>
              <ul className="mt-8 grid sm:grid-cols-2 gap-3">
                {whatsIncluded.map((item, i) => (
                  <li key={i} className="flex gap-2 text-muted-foreground">
                    <Check className="size-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={30} delay={0.3} duration={0.6}>
            <section className="mt-20">
              <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
                Who it&apos;s for
              </h2>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {whoItsFor.map((item) => (
                  <div key={item.title} className="rounded-lg border border-border bg-card px-5 py-5">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={30} delay={0.35} duration={0.6}>
            <section className="mt-20">
              <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
                Frequently asked
              </h2>
              <Accordion type="single" collapsible className="mt-8 space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded-lg border border-border bg-card px-5"
                  >
                    <AccordionTrigger className="py-5 text-left hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="font-medium text-foreground">{faq.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={30} delay={0.4} duration={0.6}>
            <div className="mt-20 pt-12 border-t border-border text-center">
              <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground">
                Ready to start?
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Six hours of live instruction. A toolkit you&apos;ll actually use. Built for adults who know AI matters but don&apos;t know where to start.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="h-12 px-8 text-base">
                  <Link href="/enroll?program=ai-toolkit-everyone">Enroll Now – $399</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                  <Link href="/contact?program=ai-toolkit-everyone">Ask a Question</Link>
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

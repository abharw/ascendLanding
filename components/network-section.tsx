import { Button } from "@/components/ui/button"
import { Users, Briefcase, Award } from "@phosphor-icons/react"

const networkTypes = [
  {
    icon: Users,
    title: "Enroll Your Kids",
    subtitle: "Parents",
    description: "Entry-level roles are disappearing. Give your kids the skills to thrive in an AI economy. Reduce the risk of a stalled career. Worth the investment — and the peace of mind.",
    cta: "Learn More",
  },
  {
    icon: Briefcase,
    title: "Bring Programs to Your School",
    subtitle: "Schools & Institutions",
    description: "Differentiate your offerings. Give students career-ready skills without building curriculum from scratch. Save time. Boost outcomes. Be the school that prepares kids for what&apos;s next.",
    cta: "Partner With Us",
  },
  {
    icon: Award,
    title: "Mentor the Next Generation",
    subtitle: "Mentors & Advisors",
    description: "Share your expertise. Give back. Be recognized as someone who builds future builders. Status that matters — and impact that lasts.",
    cta: "Become a Mentor",
  },
]

export function NetworkSection() {
  return (
    <section id="network" className="py-24 lg:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            Ways to Engage
          </p>
          <h2 className="font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-balance">
            For Parents and Schools
          </h2>
          <p className="mt-6 text-lg text-background/80 max-w-xl mx-auto">
            Protect their future. Give them an edge. Make the investment count. We&apos;re a 
            mentorship and training program that upskills young people for an economy where 
            entry-level roles are disappearing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {networkTypes.map((type) => (
            <div
              key={type.title}
              className="group relative bg-background/5 border border-background/10 rounded-lg p-8 lg:p-10 hover:bg-background/10 transition-all duration-300"
            >
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20">
                <type.icon className="size-6 text-primary" />
              </div>
              
              <p className="text-sm uppercase font-semibold tracking-widest text-background/60 mb-2">
                {type.subtitle}
              </p>
              
              <h3 className="font-semibold tracking-tight text-2xl lg:text-3xl text-background mb-4">
                {type.title}
              </h3>
              
              <p className="text-background/70 leading-relaxed mb-8">
                {type.description}
              </p>
              
              <Button 
                variant="outline" 
                className="w-full bg-transparent border-background/20 text-background hover:bg-primary hover:text-primary-foreground hover:border-primary group-hover:border-primary/50 transition-all"
              >
                {type.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

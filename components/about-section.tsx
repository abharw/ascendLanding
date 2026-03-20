"use client"

export function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
              About AscendIQ
            </p>
            <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground text-balance leading-tight">
              Turning Potential Into Practical Economic Capability.
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              AscendIQ prepares American workers for the technology-enabled economy—turning
              potential into practical capability through industry partnerships, technical
              assistance, and community-focused development.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              As automation reshapes traditional career paths, communities need workers
              equipped for roles that create lasting value. We build that capacity—connecting
              apprenticeship pathways and mentorship to real opportunities.
            </p>

            <p className="text-lg font-medium text-foreground leading-relaxed">
              We center workers as part of the solution—equipping them for good-paying roles
              and long-term career success that benefits communities across the country.
              Our work is aligned with federal workforce development initiatives and
              the goal of a sustainable AI innovation ecosystem.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="mt-20 lg:mt-28 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {[
            { headline: "Growing Cohorts", label: "Youth in Training" },
            { headline: "Nationwide", label: "Industry Mentors & Advisors" },
            { headline: "K–12 & Beyond", label: "School & Community Partners" },
            { headline: "3 Pathways", label: "Program Verticals" },
          ].map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <div className="font-bold tracking-tight text-3xl lg:text-4xl text-primary mb-2">
                {stat.headline}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import Link from "next/link"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Envelope,
  LinkedinLogo,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react"
import AnimatedContent from "@/components/AnimatedContent"

const team = [
  {
    name: "Chaitali Patel",
    role: "Founder & CEO",
    tagline: "A passionate entrepreneur and leading expert in the sustainability, finance, and fintech sectors.",
    bio: "Chaitali is a passionate entrepreneur at heart. A highly reputable finance, social impact, banking, and fintech executive -she is a leading expert in the sustainability sector; she founded Evergood, a sustainability and impact investing advisory firm, in 2017 to help investors and companies design sustainability strategies and frameworks. \n\nChaitali spent several years in the fintech sector as a go-to-market strategy expert; she led the B2B finance arm of Fundation Group, a New York-based financial technology firm as Head of Catalyst Solutions. During her banking tenure, she held senior executive positions at major financial institutions, including Bank of Hawaii, Zions Bancorp, PNC Bank, and HSBC Holdings. Her fifteen-plus years in the sector included extensive experience with business strategy, product management, bank operations, channel management, and financial reporting. She also served as Chief External Affairs Officer overseeing revenue development and external public and private sector relations functions at one of the nation’s largest military family advocacy organizations based in Washington, DC. Most recently, she served as Chief Impact Officer, leading impact investment strategy at 100 Women in Finance, a global association of women executives in asset management with 32 locations worldwide.\n\nChaitali holds a BBA in Finance from the University of North Texas, an executive certificate in Financial Planning from Georgetown University, and an MBA from the University of Utah’s Eccles School of Business. \n\nAs an entrepreneur, sustainability expert, and investor actively engaged in the academic community, she speaks and shares knowledge on business strategy, risk management, impact investing globally. She serves on the boards of commercial and social impact organizations around the world, including Hong Kong based HKmomtrepreneurs. She is also a member of the board executive committee and investment committee at UI Advisors, a donor-advised fund based in Utah.",
    email: "info@ascendiq.com",
    image: null as string | null,
    linkedin: "#",
  },
  {
    name: "Aarav Patel",
    role: "Head of Strategy",
    tagline: "An emerging entrepreneur and strategy-focused builder working at the intersection of finance, technology, and venture growth.",
    bio: "Aarav Patel is an emerging entrepreneur and strategy-focused builder working at the intersection of finance, technology, and venture growth. As Head of Strategy within the Emerging Builders program, he focuses on translating innovative ideas into scalable businesses and sustainable revenue models. Aarav studies Finance and Statistics at Carnegie Mellon University’s Tepper School of Business, where his academic and professional interests center on enterprise software companies and how strategic finance can accelerate their growth.\n\nAarav has hands-on experience helping build and scale early-stage ventures. He worked on a pothole detection startup that developed hardware and data solutions to help municipalities identify infrastructure issues more efficiently, where he contributed to growth strategy, commercialization planning, and investor communication. He also worked on an RPA-driven automation venture focused on improving operational efficiency for organizations through workflow automation. Across both ventures, Aarav concentrated on market research, monetization strategy, and product positioning, helping translate technical innovation into clear economic value.\n\nIn addition to his entrepreneurial work, Aarav has gained experience in private equity where he supported investment research and evaluated strategies for scaling companies. He will be joining BNY Mellon as a Financial Analyst this summer and will join Barclays as an Investment Banking Analyst the following summer, further developing his expertise in strategic finance and capital markets.\n\nAarav builds because he enjoys transforming ambitious ideas into real systems that create value. He is motivated by helping innovative technology companies scale through disciplined strategy, strong financial foundations, and thoughtful execution.",
    email: "aarav@ascendiq.com",
    image: null as string | null,
    linkedin: "#",
  },
  {
    name: "Arav Bhardwaj",
    role: "CTO",
    tagline: "Technical visionary focused on architecting the next generation of scalable learning platforms.",
    bio: "Arav is a technical visionary and former startup lead. He is architecting the next generation of learning platforms to ensure students are equipped with real-world technical proficiency and adaptive skills. His expertise lies in building robust, performant systems that scale with user needs while maintaining a premium user experience.",
    email: "arav@ascendiq.com",
    image: null as string | null,
    linkedin: "#",
  },
  {
    name: "Akeil Smith",
    role: "CPO",
    tagline: "Product strategist dedicated to democratizing career-ready education through innovative design.",
    bio: "Akeil is a product strategist focused on democratizing career-ready education. He designs accessible, high-impact programs that bridge the gap between traditional learning and future market needs. With a background in youth development and EdTech, he ensures that every program is both rigorous and engaging.",
    email: "akeil@ascendiq.com",
    image: null as string | null,
    linkedin: "#",
  },
]

const mentors = [
  {
    name: "Dr. Sarah Chen",
    title: "Former Director of Career Services, Stanford",
    bio: "20+ years in higher ed. Helps youth navigate the transition from school to real-world work.",
    focus: "Career readiness & internships",
  },
  {
    name: "Marcus Johnson",
    title: "Serial founder, 3 exits",
    bio: "Built and sold companies in fintech and logistics. Mentors young founders on execution and fundraising.",
    focus: "Startup Lab",
  },
  {
    name: "Jennifer Walsh",
    title: "Ex-Google, Engineering Lead",
    bio: "Spent a decade at Big Tech. Now teaches technical skills and professional habits that AI can't replace.",
    focus: "Skills & technical training",
  },
]

function TeamMemberCard({ member, index }: { member: typeof team[0], index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <AnimatedContent
      direction="vertical"
      distance={40}
      delay={index * 0.1}
      duration={0.6}
    >
      <Card className={`overflow-hidden border-border bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group flex flex-col ${isExpanded ? 'col-span-full lg:col-span-2' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="size-24 rounded-xl sm:size-28 border-2 border-border shadow-inner group-hover:border-primary/30 transition-colors">
              {member.image && (
                <AvatarImage 
                  src={member.image} 
                  alt={member.name}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="rounded-xl text-3xl font-bold text-primary bg-primary/5">
                {member.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-xl text-foreground group-hover:text-primary transition-colors">{member.name}</h3>
              <p className="text-sm text-primary font-medium tracking-wide uppercase">{member.role}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow">
          <div className="relative">
            <p className="text-muted-foreground/90 leading-relaxed text-sm lg:text-base">
              {isExpanded ? member.bio : member.tagline}
            </p>
            {member.bio.length > member.tagline.length && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-primary text-sm font-medium flex items-center gap-1 hover:underline"
              >
                {isExpanded ? (
                  <>Show Less <CaretUp className="size-4" /></>
                ) : (
                  <>Read More <CaretDown className="size-4" /></>
                )}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="sm" variant="outline" className="border-border hover:bg-primary/5 transition-colors">
              <a href={`mailto:${member.email}`}>
                <Envelope className="mr-1.5 size-3.5" />
                Email
              </a>
            </Button>
            {member.linkedin && (
              <Button asChild size="sm" variant="outline" className="border-border hover:bg-primary/5 transition-colors">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedinLogo className="mr-1.5 size-3.5" />
                  LinkedIn
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimatedContent>
  )
}

export default function TeamPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <article className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={30} duration={0.6}>
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-6">
              The Team
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground text-balance leading-tight">
              People Who Build Future Builders
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
              Meet the AscendIQ team — mentors, operators, and builders committed to upskilling young people for the modern economy.
            </p>
          </AnimatedContent>

          <div className="mt-16 lg:mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 auto-rows-fr">
            {team.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} />
            ))}
          </div>

          {/* Mentors Section */}
          <AnimatedContent direction="vertical" distance={30} delay={0.35} duration={0.6}>
            <div className="mt-24 lg:mt-32 pt-16 border-t border-border">
              <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
                Mentors & Advisors
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-foreground mb-6">
                Operators Who Give Back
              </h2>
              <p className="text-muted-foreground max-w-2xl mb-12">
                Our mentor network brings real-world experience from startups, Big Tech, and education — 
                so young people learn from people who&apos;ve actually built things.
              </p>
            </div>
          </AnimatedContent>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {mentors.map((mentor, index) => (
              <AnimatedContent
                key={mentor.name}
                direction="vertical"
                distance={30}
                delay={0.4 + index * 0.08}
                duration={0.6}
              >
                <Card className="overflow-hidden border-border bg-card/50 hover:border-primary/20 transition-colors h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-4">
                      <Avatar className="size-16 rounded-lg shrink-0 border border-border">
                        <AvatarFallback className="rounded-lg text-lg font-semibold text-primary bg-primary/10">
                          {mentor.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{mentor.title}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 flex-grow">
                    <p className="text-sm text-muted-foreground leading-relaxed">{mentor.bio}</p>
                    <p className="text-xs font-medium text-primary mt-auto">{mentor.focus}</p>
                  </CardContent>
                </Card>
              </AnimatedContent>
            ))}
          </div>

          <AnimatedContent direction="vertical" distance={30} delay={0.65} duration={0.6}>
            <div className="mt-20 pt-16 border-t border-border text-center">
              <p className="text-muted-foreground mb-6">
                Want to join the team or become a mentor?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/mission">Learn Our Mission</Link>
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

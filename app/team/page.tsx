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

const leadership = [
  {
    name: "Chaitali Patel",
    role: "Founder & CEO",
    tagline: "A passionate entrepreneur and leading expert in the sustainability, finance, and fintech sectors.",
    bio: "Chaitali is a passionate entrepreneur at heart. A highly reputable finance, social impact, banking, and fintech executive -she is a leading expert in the sustainability sector; she founded Evergood, a sustainability and impact investing advisory firm, in 2017 to help investors and companies design sustainability strategies and frameworks. \n\nChaitali spent several years in the fintech sector as a go-to-market strategy expert; she led the B2B finance arm of Fundation Group, a New York-based financial technology firm as Head of Catalyst Solutions. During her banking tenure, she held senior executive positions at major financial institutions, including Bank of Hawaii, Zions Bancorp, PNC Bank, and HSBC Holdings. Her fifteen-plus years in the sector included extensive experience with business strategy, product management, bank operations, channel management, and financial reporting. She also served as Chief External Affairs Officer overseeing revenue development and external public and private sector relations functions at one of the nation’s largest military family advocacy organizations based in Washington, DC. Most recently, she served as Chief Impact Officer, leading impact investment strategy at 100 Women in Finance, a global association of women executives in asset management with 32 locations worldwide.\n\nChaitali holds a BBA in Finance from the University of North Texas, an executive certificate in Financial Planning from Georgetown University, and an MBA from the University of Utah’s Eccles School of Business. \n\nAs an entrepreneur, sustainability expert, and investor actively engaged in the academic community, she speaks and shares knowledge on business strategy, risk management, impact investing globally. She serves on the boards of commercial and social impact organizations around the world, including Hong Kong based HKmomtrepreneurs. She is also a member of the board executive committee and investment committee at UI Advisors, a donor-advised fund based in Utah.",
    email: "info@ascendiq.com",
    image: "/team/chaitali_patel.jpeg",
    linkedin: "#",
  },
  {
    name: "Aarav Patel",
    role: "COO & CFO",
    tagline: "An emerging entrepreneur and strategy-focused builder working at the intersection of finance, technology, and venture growth.",
    bio: "Aarav Patel is an emerging entrepreneur and strategy-focused builder working at the intersection of finance, technology, and venture growth. As Head of Strategy within the Emerging Builders program, he focuses on translating innovative ideas into scalable businesses and sustainable revenue models. Aarav studies Finance and Statistics at Carnegie Mellon University’s Tepper School of Business, where his academic and professional interests center on enterprise software companies and how strategic finance can accelerate their growth.\n\nAarav has hands-on experience helping build and scale early-stage ventures. He worked on a pothole detection startup that developed hardware and data solutions to help municipalities identify infrastructure issues more efficiently, where he contributed to growth strategy, commercialization planning, and investor communication. He also worked on an RPA-driven automation venture focused on improving operational efficiency for organizations through workflow automation. Across both ventures, Aarav concentrated on market research, monetization strategy, and product positioning, helping translate technical innovation into clear economic value.\n\nIn addition to his entrepreneurial work, Aarav has gained experience in private equity where he supported investment research and evaluated strategies for scaling companies. He will be joining BNY Mellon as a Financial Analyst this summer and will join Barclays as an Investment Banking Analyst the following summer, further developing his expertise in strategic finance and capital markets.\n\nAarav builds because he enjoys transforming ambitious ideas into real systems that create value. He is motivated by helping innovative technology companies scale through disciplined strategy, strong financial foundations, and thoughtful execution.",
    email: "aarav@ascendiq.com",
    image: "/team/aarav_patel.jpg",
    linkedin: "#",
  },
  {
    name: "Arav Bhardwaj",
    role: "CTO",
    tagline: "Technical visionary focused on architecting the next generation of scalable learning platforms.",
    bio: "Arav is a technical visionary and former startup lead. He is architecting the next generation of learning platforms to ensure students are equipped with real-world technical proficiency and adaptive skills. His expertise lies in building robust, performant systems that scale with user needs while maintaining a premium user experience.",
    email: "arav@ascendiq.com",
    image: "/team/arav_bhardwaj.jpg",
    linkedin: "#",
  },
]

const team = [
  {
    name: "Serena Aurora",
    role: "CoS / Head of Schools Solutions",
    tagline: "Co-Founder and Chief of Staff leading platform strategy, operational execution, and institutional partnerships.",
    bio: "Serena Aurora is Co-Founder, Chief of Staff, and Head of School Solutions at Motherboard, where she leads platform strategy, operational execution, and institutional partnerships. She focuses on building scalable systems that bridge the gap between education and workforce readiness, designing programs that equip students with practical skills and decision-making capabilities aligned with today's labor market.\n\nSerena holds a background in finance and strategy from Virginia Tech's Pamplin College of Business. Her work integrates financial analysis, program design, and cross-functional operations to drive measurable outcomes and sustainable growth. She has experience across financial modeling, process optimization, and stakeholder management, with a strong emphasis on translating strategy into execution.\n\nIn addition, Serena is a co-founder of HerHealth Foundation, where she led early-stage strategy and partnership development to expand access to essential resources for underserved communities. Her broader focus is on building systems and organizations that create clear, scalable pathways from education to meaningful employment.",
    email: "info@ascendiq.com",
    image: "/team/serena_aurora.png",
    linkedin: "https://www.linkedin.com/in/serena-aurora",
  },
  {
    name: "Dia Aurora",
    role: "Head of Finance",
    tagline: "Finance and Ops Lead, creating inclusive, high-impact systems.",
    bio: "Dia is a junior at Indiana University studying business, with hands-on experience in leadership, strategy, and problem-solving. She has led recruitment for Kappa Eta Phi, building inclusive pipelines and stronger community connections. Dia has also worked on projects in accounting, financial modeling, AI research, and environmental trend analysis. She thrives in roles that mix structure, creativity, and real impact. Her skills include financial analysis, market research, and pitching ideas effectively. Outside of work, Dia is an avid tennis player, drawing strategy and focus from the sport into her leadership and academics.",
    email: "info@ascendiq.com",
    image: "/team/dia_aurora.png",
    linkedin: "https://www.linkedin.com/in/dia-aurora",
  },
  {
    name: "Cal Burke",
    role: "Deputy Chief of Staff",
    tagline: "Bringing leadership, entrepreneurship, and service to every project he touches.",
    bio: "Cal Burke, a finance freshman at Belmont University, combines leadership, entrepreneurship, and service in his work. Raised in Utah in a military family, he learned discipline, teamwork, and community responsibility early on. He’s led service projects as an Eagle Scout and advocated for youth voices in his church, building leadership and public speaking skills. Cal keeps active with tennis, pickleball, and weightlifting, emphasizing growth and resilience. At Motherboard, he serves as Administration Lead, bringing organization and a service-oriented approach. He’s committed to helping communities and projects thrive while developing his own skills.",
    email: "info@ascendiq.com",
    image: "/team/cal_burke.png",
    linkedin: "https://www.linkedin.com/in/cal-burke-56634b256",
  },
  {
    name: "Dr. Aiyaz Husain",
    role: "Head of College & University Partnerships",
    tagline: "Historian and former public servant forging connections between academia and practitioners.",
    bio: "Aiyaz Husain is Head of Higher Education Partnerships at Ascend IQ. A historian and former public servant with deep ties to the U.S. academic community, he was most recently the National Partnerships Director for the World Affairs Councils of America, helping that organization find external partners to work with the 90 Councils in its nationwide network. Prior to that, he served as Head of Research at Evergood Impact, a sustainability consulting firm in Arlington, Virginia. He is a twelve-year veteran of the U.S. Department of State, where he produced internal studies of U.S. policy at the Office of the Historian and led an outreach initiative to educate universities, think tanks and journalists about the Office’s research and publications.\n\nThroughout his career, Aiyaz has helped forge connections between academic researchers and practitioners--including policy makers in government and the nonprofit sector. He is a former member of the American Historical Association and the Society of Historians of American Foreign Relations, and briefed participants in the Washington Decolonization Seminar on the work of the State Department from 2010 to 2015 during that annual summer program.\n\nAiyaz holds a bachelor’s degree in History from Yale University, where he was a National Merit Scholar, and Master’s and PhD degrees from the Fletcher School of Law and Diplomacy at Tufts University, where he was the C.V. Starr Scholar. His book Mapping the End of Empire was published by Harvard University Press in 2014.",
    email: "info@ascendiq.com",
    image: "/team/dr_aiyaz_husain.png",
    linkedin: "https://www.linkedin.com/in/aiyaz-husain-240406147",
  },
  {
    name: "Armaan Goraya",
    role: "SMB Solutions Head",
    tagline: "AI-focused computer science student building smarter tools at the intersection of tech and strategy.",
    bio: "Armaan Goraya is a computer science student at George Mason University with a passion for AI and emerging tech. He’s fascinated by how fast-changing technologies can reshape industries and solve problems at scale. Armaan enjoys exploring where tech, strategy, and real-world applications meet. His work focuses on using AI and advanced computing to build smarter tools and improve efficiency. Driven by curiosity, he’s always learning and sharpening the skills needed to make an impact. He’s committed to staying ahead of technological change and contributing to the next wave of innovation.",
    email: "info@ascendiq.com",
    image: "/team/armaan_goraya.png",
    linkedin: "https://www.linkedin.com/in/armaansgoraya",
  },
  {
    name: "Aman Patel",
    role: "SMB Solutions Lead",
    tagline: "Building better systems and experiences, turning ideas into reliable processes.",
    bio: "Aman Patel is all about building better systems and experiences. As Head of Customer Experience at Motherboard, he works on making sure everything runs smoothly for students and partners. He’s an Entrepreneurship and Marketing major at Suffolk, where he also launched and scaled the university’s Entrepreneurship Club. His experience ranges from organizing teams and building processes to improving operations in a busy retail environment. He’s also supported large community events, handling logistics and making them more efficient each time. He’s motivated by turning ideas into systems that people can rely on.",
    email: "info@ascendiq.com",
    image: "/team/aman_patel.png",
    linkedin: "https://www.linkedin.com/in/aman-patel-5487a72a1",
  },
  {
    name: "Aisha Myneni",
    role: "CX / Customer Experience Head",
    tagline: "Building at the intersection of operations and tech, turning data into actionable decisions.",
    bio: "Aisha Myneni is Head of Digital Delivery & Distribution at Emerging Builders and studies Supply Chain Management and Business Analytics at Indiana University’s Kelley School of Business. She builds at the intersection of operations and tech, turning data into actionable decisions. She’s grown Women Impacting Supply Chain Excellence (WISE) by leading sponsorships, partnerships, and industry connections. Aisha also manages recruitment for 150+ candidates, designs systems to boost accountability, and leverages analytics and AI to streamline processes. Her strengths include partnerships, operational design, data-driven strategy, and team leadership. Outside of work, she enjoys long walks, staying active, and connecting with her community.",
    email: "info@ascendiq.com",
    image: "/team/aisha_myneni.png",
    linkedin: "https://www.linkedin.com/in/aishamyneni",
  },
  {
    name: "Siena Baglio",
    role: "CS / Client Success Lead",
    tagline: "Turning ideas into real, community-driven initiatives focused on growth and support.",
    bio: "Siena Baglio is a Wake Forest freshman on the pre-business track and Motherboard’s Head of Customer Success and Experience. She’s built a reputation for turning ideas into real, community-driven initiatives. She led The Princess Ball Junior Board, running a large-scale charity event and managing teams, sponsors, and operations. In dance, she’s reimagined performances and started a mentorship program to build stronger culture and retention. She’s also worked in inclusive spaces, from teaching dance to adults with disabilities to supporting equine therapy. At her core, she’s focused on creating environments where people feel supported and inspired to grow.",
    email: "info@ascendiq.com",
    image: "/team/siena_baglio.png",
    linkedin: "https://www.linkedin.com/in/siena-baglio-8a0386357",
  },
  {
    name: "Rachel Burke",
    role: "Brand Lead",
    tagline: "Creative and detail-oriented marketer with a passion for strategic communication and the arts.",
    bio: "Rachel is a creative and detail-oriented sophomore studying marketing at Belmont University, with a passion for thoughtful expression and strategic communication shaped by her background in the arts. Her experience in Model United Nations has strengthened her skills in public speaking, critical thinking, and global awareness. She is also deeply committed to service and leadership, having volunteered with the Good Samaritan program, participated in mission trips, and worked with the homeless-experienced sheltering program \"The Point.\" In addition, she has served as a youth representative for the Episcopal Church, further developing her leadership and advocacy skills. In her free time, Rachel enjoys playing tennis and pickleball, bringing the same focus and energy to all of her pursuits.",
    email: "info@ascendiq.com",
    image: "/team/rachel_burke.png",
    linkedin: "https://www.linkedin.com/in/rachel-burke-008a603ba",
  },
]

function TeamMemberCard({ member, index }: { member: typeof leadership[0], index: number }) {
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
            {leadership.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} />
            ))}
          </div>

          {/* Team Section */}
          <AnimatedContent direction="vertical" distance={30} delay={0.35} duration={0.6}>
            <div className="mt-24 lg:mt-32 pt-16 border-t border-border">
              <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">
                The Team
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-foreground mb-6">
                The People Behind the Mission
              </h2>
              <p className="text-muted-foreground max-w-2xl mb-12">
                Our team brings real-world experience from finance, tech, operations, and education —
                working together to build scalable pathways from learning to career.
              </p>
            </div>
          </AnimatedContent>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 auto-rows-fr">
            {team.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index + leadership.length} />
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

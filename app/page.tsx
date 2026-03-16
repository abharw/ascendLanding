import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PillarsSection } from "@/components/pillars-section"
import { WhoWeServeSection } from "@/components/who-we-serve-section"
import { AboutSection } from "@/components/about-section"
import { ProblemsSection } from "@/components/problems-section"
import { TrustSection } from "@/components/trust-section"
import { CtaStrip } from "@/components/cta-strip"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <PillarsSection />
      <WhoWeServeSection />
      <ProblemsSection />
      <AboutSection />
      <TrustSection />
      <CtaStrip />
      <Footer />
    </main>
  )
}

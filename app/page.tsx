import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { WhoWeServeSection } from "@/components/who-we-serve-section"
import { AboutSection } from "@/components/about-section"
import { PillarsSection } from "@/components/pillars-section"
import { TrustSection } from "@/components/trust-section"
import { CtaStrip } from "@/components/cta-strip"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <WhoWeServeSection />
      <AboutSection />
      <PillarsSection />
      <TrustSection />
      <CtaStrip />
      <Footer />
    </main>
  )
}

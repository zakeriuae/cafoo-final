import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ProjectsSection } from "@/components/projects-section"
import { PropertiesSection } from "@/components/properties-section"
import { AreasSection } from "@/components/areas-section-wrapper"
import { DevelopersSection } from "@/components/developers-section-wrapper"
import { AgentsSection } from "@/components/agents-section-wrapper"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ProjectsSection />
      <PropertiesSection />
      <AreasSection />
      <DevelopersSection />
      <AgentsSection />
      <AboutSection />
      <Footer />
    </main>
  )
}

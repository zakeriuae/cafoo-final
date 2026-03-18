import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ProjectsSection } from "@/components/projects-section"
import { PropertiesSection } from "@/components/properties-section"
import { AreasSection } from "@/components/areas-section"
import { DevelopersSection } from "@/components/developers-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ProjectsSection />
      <PropertiesSection />
      <AreasSection />
      <DevelopersSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}

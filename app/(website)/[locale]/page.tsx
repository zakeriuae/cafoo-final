import { Suspense } from "react"
// Force rebuild for minimal design update - v2
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ProjectsSection } from "@/components/projects-section"
import { PropertiesSection } from "@/components/properties-section"
import { AreasSection } from "@/components/areas-section-wrapper"
import { DevelopersSection } from "@/components/developers-section-wrapper"
import { AgentsSection } from "@/components/agents-section-wrapper"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"

function SectionLoading() {
  return (
    <div className="py-24 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <Suspense fallback={<SectionLoading />}>
        <ProjectsSection />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <PropertiesSection />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <AreasSection />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <DevelopersSection />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <AgentsSection />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <AboutSection />
      </Suspense>
      <Footer />
    </main>
  )
}

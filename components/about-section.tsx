"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Users, Award, Shield, ArrowRight } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Expert Team",
    description: "Experienced consultants well-versed in the UAE real estate market",
  },
  {
    icon: Award,
    title: "Premium Service",
    description: "Professional solutions to help you protect and grow your investments",
  },
  {
    icon: Shield,
    title: "Trusted Partner",
    description: "Your trusted companion and consultant on your investment journey",
  },
]

const achievements = [
  "500+ Happy Clients",
  "10+ Years Experience",
  "AED 2B+ in Transactions",
  "Top Rated on Google",
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/luxury-apartment.jpg"
                alt="Cafoo Real Estate Office"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-xl shadow-xl border border-border max-w-xs">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-2xl">10+</p>
                  <p className="text-sm text-muted-foreground">Years of Excellence</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted by hundreds of clients across the UAE
              </p>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <p className="text-secondary font-medium mb-2 tracking-wider uppercase">
              About Cafoo
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Your Trusted Real Estate Partner in Dubai
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Cafoo Real Estate Advisors Group, with years of valuable experience in 
              buying, selling, and real estate investment in Dubai, is proud to be 
              your trusted companion and consultant on this journey.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our team of experienced experts, well-versed in the UAE real estate 
              market, are ready to provide professional solutions to help you protect 
              and grow your investments.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {achievements.map((achievement) => (
                <div key={achievement} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="text-sm text-foreground">{achievement}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Learn More About Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

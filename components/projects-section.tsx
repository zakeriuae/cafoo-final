"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, CreditCard, Building2, ArrowRight, MessageCircle } from "lucide-react"
import { useState } from "react"

const projects = [
  {
    id: 1,
    name: "Ocean 2",
    developer: "Danube Properties",
    location: "Dubai Mina Rashid",
    launchPrice: "900,000 AED",
    paymentPlan: "70/30",
    deliveryTime: "2027 Q1",
    type: "Apartment",
    status: "Off-Plan",
    image: "/images/downtown-dubai.jpg",
    featured: true,
  },
  {
    id: 2,
    name: "340 Riverside Crescent",
    developer: "SOBHA REALTY",
    location: "Sobha Hartland",
    launchPrice: "1,320,000 AED",
    paymentPlan: "50/50",
    deliveryTime: "2027",
    type: "Apartment",
    status: "Off-Plan",
    image: "/images/dubai-marina.jpg",
    featured: true,
  },
  {
    id: 3,
    name: "Trump Tower",
    developer: "DAR AL ARKAN",
    location: "Dubai Za'abeel",
    launchPrice: "3,800,000 AED",
    paymentPlan: "90/10",
    deliveryTime: "2031 Q3",
    type: "Apartment",
    status: "Off-Plan",
    image: "/images/luxury-apartment.jpg",
    featured: true,
  },
  {
    id: 4,
    name: "The Address Sky View",
    developer: "EMAAR PROPERTIES",
    location: "Dubai Downtown",
    launchPrice: "Starting from 2,500,000 AED",
    paymentPlan: "0/100",
    deliveryTime: "Ready",
    type: "Hotel Apartment",
    status: "Ready",
    image: "/images/downtown-dubai.jpg",
    featured: false,
  },
  {
    id: 5,
    name: "Boulevard Crescent",
    developer: "EMAAR PROPERTIES",
    location: "Dubai Downtown",
    launchPrice: "2,000,000 AED",
    paymentPlan: "0/100",
    deliveryTime: "Ready",
    type: "Apartment",
    status: "Ready",
    image: "/images/dubai-marina.jpg",
    featured: false,
  },
  {
    id: 6,
    name: "THE OPUS",
    developer: "OMNIYAT",
    location: "Dubai Business Bay",
    launchPrice: "Starting from 3,000,000 AED",
    paymentPlan: "100/0",
    deliveryTime: "2025",
    type: "Apartment",
    status: "Ready",
    image: "/images/luxury-apartment.jpg",
    featured: false,
  },
]

const filters = ["All", "Off-Plan", "Ready", "Apartment", "Villa", "Penthouse"]

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.status === activeFilter || p.type === activeFilter)

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-secondary font-medium mb-2 tracking-wider uppercase">
            Exclusive Developments
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the most prestigious real estate projects in Dubai from 
            world-renowned developers. From off-plan investments to ready-to-move residences.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card text-foreground hover:bg-muted border border-border"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-card">
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={`${project.status === "Off-Plan" ? "bg-secondary" : "bg-green-600"} text-white`}>
                    {project.status}
                  </Badge>
                  {project.featured && (
                    <Badge className="bg-amber-500 text-white">Featured</Badge>
                  )}
                </div>

                {/* Developer */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/80 text-sm">{project.developer}</p>
                  <h3 className="text-white text-xl font-bold">{project.name}</h3>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4 text-secondary" />
                    <span className="text-sm">{project.type}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Starting Price</p>
                      <p className="font-semibold text-primary">{project.launchPrice}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Payment Plan</p>
                      <p className="font-semibold text-foreground">{project.paymentPlan}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Delivery: {project.deliveryTime}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                  <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            View All Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}

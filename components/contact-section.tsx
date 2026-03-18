"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageCircle
} from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["3202, Boulevard Plaza Tower 1", "Downtown, Dubai, UAE"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+971 50 349 1050", "+971 52 504 1810"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@cafoo.ae", "sales@cafoo.ae"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Sun - Thu: 9AM - 6PM", "Fri - Sat: 10AM - 4PM"],
  },
]

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <p className="text-secondary font-medium mb-2 tracking-wider uppercase">
              Get in Touch
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Contact Our Team
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Ready to find your dream property in Dubai? Our expert team is here 
              to guide you through every step of your real estate journey.
            </p>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="p-4 bg-muted/50 rounded-xl border border-border hover:border-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{info.title}</h3>
                  </div>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground pl-13">
                      {detail}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="p-6 bg-green-600/10 border border-green-600/20 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Quick Response via WhatsApp</h3>
                  <p className="text-sm text-muted-foreground">Get instant answers from our team</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Chat Now
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
            <h3 className="text-xl font-bold text-foreground mb-6">
              Send Us a Message
            </h3>
            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <Input 
                    placeholder="Your name" 
                    className="bg-background border-input focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input 
                    placeholder="+971 XX XXX XXXX" 
                    className="bg-background border-input focus:border-secondary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="bg-background border-input focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Interest
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-secondary focus:border-transparent">
                  <option value="">Select your interest</option>
                  <option value="buy">Buying Property</option>
                  <option value="sell">Selling Property</option>
                  <option value="rent">Renting Property</option>
                  <option value="invest">Investment Consultation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea 
                  placeholder="Tell us about your requirements..." 
                  className="bg-background border-input focus:border-secondary min-h-[120px]"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

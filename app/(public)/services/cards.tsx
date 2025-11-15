"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, GraduationCap, Briefcase, Lightbulb, Video, BookOpen, Award, BarChart3 } from "lucide-react"
import { services } from "./data"

const iconMap = {
  video: Video,
  users: Users,
  bookOpen: BookOpen,
  graduationCap: GraduationCap,
  briefcase: Briefcase,
  lightbulb: Lightbulb,
  award: Award,
  barChart3: BarChart3,
} as const

export default function Cards() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}

      {/* Our Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Register for Our Services</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = iconMap[service.iconKey]
              const href = `/services/${service.slug}`
              return (
                <Card
                  key={service.slug}
                  className="text-center hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(href)}
                >
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-[#245D51] rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{service.shortDescription}</p>
                    <Link href={href} onClick={(e) => e.stopPropagation()}>
                      <Button className="w-full bg-[#245D51] hover:bg-[#245D51]/90 text-white">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

 
      
    </div>
  )
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Users, GraduationCap, Briefcase, Lightbulb } from "lucide-react"

const services = [
  {
    icon: User,
    title: "Tutor",
    description:
      "We provide a platform for registering tutors to offer high-quality tutorial services tailored for high school students.",
    link: "/register/tutor"
  },
  {
    icon: Users,
    title: "Tutee",
    description:
      "We provide a platform for students to register as tutees and receive personalized tutoring services.",
    link: "/register/tutee"
  },
  {
    icon: Lightbulb,
    title: "Research",
    description:
      "We provide professional research consultation services tailored to guide individuals in their academic and strategic endeavors.",
    link: "/register/research"
  },
  {
    icon: GraduationCap,
    title: "Training",
    description:
      "We offer comprehensive training programs in various fields to enhance skills and knowledge.",
    link: "/register/training"
  },
  {
    icon: Briefcase,
    title: "Entrepreneurship",
    description:
      "We provide tailored services to empower individuals in their entrepreneurial journey, focusing on personal and business growth.",
    link: "/register/entrepreneurship"
  },
]

export default function ServicesPage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <section
        className="text-white px-6 min-h-[50svh] relative pt-28"
        style={{
          backgroundImage: "url(/images/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto min-h-[calc(50svh_-_7rem)] flex items-center">
          <h1 className="text-5xl font-bold">Services</h1>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Our Services</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-[#245D51] rounded-full flex items-center justify-center mx-auto mb-6">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{service.description}</p>
                  <Link href={service.link}>
                    <Button className="w-full bg-[#245D51] hover:bg-[#245D51]/90 text-white">
                      Register Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

 
      
    </div>
  )
}

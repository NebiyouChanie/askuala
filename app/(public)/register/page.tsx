"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, GraduationCap, Monitor, Lightbulb, Briefcase, Users, Video, Award, BarChart3 } from "lucide-react"
import { services as allServices } from "@/app/(public)/services/data"

const options = [
  {
    id: "tutor",
    title: "Tutor Registration",
    href: "/register/tutor",
    icon: BookOpen,
    description: "Apply to teach and support students across multiple subjects."
  },
  {
    id: "tutee",
    title: "Tutee Registration",
    href: "/register/tutee",
    icon: GraduationCap,
    description: "Request tutoring and get matched with qualified instructors."
  },
  {
    id: "training",
    title: "Training Registration",
    href: "/register/training",
    icon: Monitor,
    description: "Enroll in professional trainings to upskill and grow."
  },
  {
    id: "research",
    title: "Research Registration",
    href: "/register/research",
    icon: Lightbulb,
    description: "Get advisory and support for academic or professional research."
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship Registration",
    href: "/register/entrepreneurship",
    icon: Briefcase,
    description: "Join programs designed to support founders and innovators."
  }
]

export default function RegisterIndexPage() {
  const iconMap: Record<string, React.ElementType> = {
    video: Video,
    users: Users,
    bookOpen: BookOpen,
    graduationCap: GraduationCap,
    briefcase: Briefcase,
    lightbulb: Lightbulb,
    award: Award,
    barChart3: BarChart3,
  }

  const computeServiceHref = (slug: string, ctaLink?: string) => {
    const base = ctaLink || "/contact"
    if (base.startsWith("/register/training")) {
      const hasQuery = base.includes("?")
      return `${base}${hasQuery ? "&" : "?"}service=${encodeURIComponent(slug)}`
    }
    if (base === "/contact") {
      return `/register/training?service=${encodeURIComponent(slug)}`
    }
    return base
  }

  const serviceOptions = allServices.map((svc) => {
    const Icon = iconMap[svc.iconKey] || Briefcase
    return {
      id: `service-${svc.slug}`,
      title: svc.title,
      href: computeServiceHref(svc.slug, svc.ctaLink),
      icon: Icon,
      description: svc.shortDescription,
    }
  })
  const allCards = [...options, ...serviceOptions]

  return (
    <div className="min-h-screen bg-white">
      <section
        className="text-white px-6 min-h-[40svh] relative pt-28"
        style={{
          backgroundImage: "url(/images/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto min-h-[calc(40svh_-_7rem)] flex items-center">
          <div>
            <h1 className="text-4xl font-bold">Register</h1>
            <p className="text-white/90 mt-2">Choose the registration type below.</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCards.map((opt) => {
            const Icon = opt.icon
            return (
              <Card key={opt.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#245D51]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{opt.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 flex-1">{opt.description}</p>
                  <div className="mt-6">
                    <Link href={opt.href}>
                      <Button className="bg-[#FF6652] hover:bg-[#e55a4a] text-white">Open Form</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}


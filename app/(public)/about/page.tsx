"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Compass, Award, Search, UserCircle, Play, Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const whyChooseUs = [
  {
    icon: Target,
    title: "About",
    description:
      "Askuala Educational Consultancy PLC is a leading Ethiopian online and hybrid consultancy transforming learning and professional development with innovative, affordable, technology‑driven services: on‑demand tutoring, professional trainings, strategic consultations, research advisory, scholarship support, research/document reviews, data entry, curriculum development, and institutional capacity building.",
  },
  {
    icon: Eye,
    title: "Vision",
    description:
      "To become Ethiopia’s premier educational consultancy and EdTech provider by 2030, delivering tutoring, training, consultations, scholarship support, research/document reviews, data entry, and related services to foster an inclusive, knowledge‑driven society with regional impact in East Africa.",
  },
  {
    icon: Compass,
    title: "Mission",
    description:
      "We encourage curiosity, enlighten through expert solutions, and empower students, educators, and institutions with affordable, technology‑enabled services tailored to Ethiopia’s challenges, including overcrowded classrooms and limited rural access. Our holistic approach promotes equitable education and professional growth.",
  },
  {
    icon: Award,
    title: "Value",
    description:
      "Core Values: Empower, Quality, Innovation, Accessibility, Sustainability.",
  },
]

type PublicInstructor = {
  instructor_id: string
  first_name: string
  last_name: string
  bio: string | null
  average_rating: number | null
  rating_count: number | null
  years_experience: number | null
  hourly_rate_etb: number | null
}

const stats = [
  { number: "276K", label: "Worldwide Students" },
  { number: "23", label: "Years Experience" },
  { number: "735", label: "Professional Courses" },
  { number: "407K", label: "Beautiful Review" },
]

// Counter component for animated numbers
function Counter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])



  useEffect(() => {
    if (!isVisible) return


    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div ref={ref}>
      <h3 className="text-5xl font-bold mb-2">
        {count.toLocaleString()}{suffix}
      </h3>
    </div>
  )
}

export default function AboutPage() {
  const [loadingInstructors, setLoadingInstructors] = useState(false)
  const [instructors, setInstructors] = useState<PublicInstructor[]>([])

  const formatRating = (val: any) => {
    const n = typeof val === 'number' ? val : parseFloat(val ?? '0')
    return Number.isFinite(n) ? n.toFixed(2) : '0.00'
  }

  useEffect(() => {
    const load = async () => {
      setLoadingInstructors(true)
      try {
        const res = await fetch('/api/instructors?limit=6', { cache: 'no-store' })
        const json = await res.json()
        if (res.ok && json?.success) {
          setInstructors(json.data || [])
        } else {
          setInstructors([])
        }
      } catch {
        setInstructors([])
      } finally {
        setLoadingInstructors(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <section
        className="text-white px-4 sm:px-6 min-h-[40svh] md:min-h-[50svh] relative pt-20 md:pt-28"
        style={{
          backgroundImage: "url(/images/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto min-h-[calc(50svh_-_7rem)] flex items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">About</h1>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Choose Us</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                    <div
                        className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
                        index === 1 ? "bg-[#FF6652]" : "bg-[#245D51]"
                      }`}
                    >
                        <item.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">{item.title}</h3>
                    </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HD Quality Video Section */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="bg-[#FF6652] text-white mb-4">Live Classes</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              HD Quality Video, Audio
              <br />& Live Classes
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden">
              <img src="/logo.jpg" alt="Online teaching" className="w-full h-96 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <Button className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center">
                  <Play className="w-8 h-8 text-[#245D51] ml-1" />
                </Button>
              </div>

              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>LIVE</span>
              </div>

              <div className="absolute bottom-4 left-4 bg-white rounded-lg p-2 shadow-lg">
                <img src="/logo.jpg" alt="Student" className="w-12 h-12 rounded object-cover" />
              </div>

              <div className="absolute bottom-4 right-4 flex space-x-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-[#245D51]">📞</span>
                </div>
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white">📞</span>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white">💬</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Statistics Section */}
      {/* <section className="py-20 bg-[#245D51] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => {
              const numberMatch = stat.number.match(/^(\d+)([K]?)$/)
              const number = numberMatch ? parseInt(numberMatch[1]) : 0
              const suffix = numberMatch ? numberMatch[2] : ""
              
              return (
                <div key={index}>
                  <Counter 
                    end={number} 
                    duration={2000} 
                    suffix={suffix}
                  />
                  <p className="text-gray-300">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section> */}

      {/* Expert Instructors Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
              <Badge className="bg-[#FF6652] text-white mb-4">Instructor</Badge>
              <h2 className="text-4xl font-bold text-gray-900">Our Expert Instructor</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {instructors.map((ins) => {
              const name = `${ins.first_name} ${ins.last_name}`
              const avg = ins.average_rating ?? 0
              const count = ins.rating_count ?? 0
              return (
                <Card key={ins.instructor_id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                        src={"/images/logo.jpg"}
                        alt={name}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                  </div>

                  <div className="p-6">
                    <div className="text-center mb-4">
                        <p className="text-sm text-gray-500 mb-1">INSTRUCTOR</p>
                        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                    </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{formatRating(avg)} ({count})</span>
                      </div>
                        {ins.years_experience != null && <div>{ins.years_experience} yrs</div>}
                      </div>
                      {ins.bio && <p className="text-sm text-gray-700 line-clamp-4">{ins.bio}</p>}
                  </div>
                </CardContent>
              </Card>
              )
            })}
            {instructors.length === 0 && !loadingInstructors && (
              <div className="text-gray-600">No instructors found.</div>
            )}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/instructors">
              <Button className="bg-[#FF6652] hover:bg-[#e55a4a] text-white px-6 py-3">See All Instructors</Button>
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  )
}

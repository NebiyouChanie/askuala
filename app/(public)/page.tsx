import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Users,
  BookOpen,
  Video,
  Award,
  Globe,
  Camera,
  Code,
  BarChart3,
  Smartphone,
  Briefcase,
} from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
       
      

      {/* Hero Section */}
      <section
        className="text-white px-6 min-h-svh relative pt-28"
        style={{
          backgroundImage: "url(/images/hero-bg2.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100svh_-_7rem)]">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Affordable, technology‑driven tutoring, training, and consultancy for every <span className="text-[#FF6652] ">learner and institution</span>.
            </h1>
            <p className="text-xl text-teal-100 mb-8 leading-relaxed">
              Askuala Educational Consultancy PLC is an Ethiopian online and hybrid platform delivering on‑demand tutoring, professional trainings, strategic consultations, scholarship search support, research/document reviews, data entry, and more—tailored for students, educators, schools, NGOs, and businesses.
            </p>
            <Button className="bg-[#FF6652] hover:bg-[#e55a4a] text-white font-semibold px-8 py-3 text-lg">Get Started</Button>
          </div>

          <div className="relative">
            <div className=" rounded-2xl h-[500px] w-full p-8 ">
              <Image
                src="/images/hero.png"
                alt="Student working on laptop"
                fill
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-600 mb-4">Service</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-[#245D51]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">On‑Demand Tutoring</h3>
                <p className="text-gray-600">
                  Personalized live support and detailed explanations that build real understanding.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="w-8 h-8 text-[#245D51]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Face‑to‑Face Support</h3>
                <p className="text-gray-600">
                  In‑person sessions for immediate feedback and highly engaging learning experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-[#245D51]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Professional Trainings</h3>
                <p className="text-gray-600">
                  Workshops for educators and professionals to upskill and stay ahead.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-[#245D51]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Strategic Consultations</h3>
                <p className="text-gray-600">
                  Curriculum, policy, capacity building, e‑learning advisory, and assessment tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <Badge className="bg-orange-100 text-orange-600 mb-4">About Our Service</Badge>
              <Image
                src="/images/logo.jpg"
                alt="Student studying"
                width={500}
                height={400}
                className="rounded-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-full p-4 shadow-lg">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#245D51]" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Empowering learning and professional growth in Ethiopia</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We offer hybrid, affordable, and technology‑enabled services—from tutoring and trainings to research advisory, scholarship support, reviews, data entry, and institutional capacity building—designed for students, educators, schools, NGOs, and businesses.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-orange-400 rounded-full border-2 border-white"></div>
                  <div className="w-10 h-10 bg-teal-400 rounded-full border-2 border-white"></div>
                  <div className="w-10 h-10 bg-purple-400 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-gray-600">Join thousands of learners</span>
              </div>
              <Button className="bg-[#FF6652] hover:bg-[#e55a4a] text-white px-8 py-3">Get Started</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-600 mb-4">Category</Badge>
            <h2 className="text-4xl font-bold text-gray-900">Top Categories</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Online Tutoring</h3>
                    <p className="text-sm text-gray-600">Live + asynchronous support</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-[#245D51]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Research Advisory</h3>
                    <p className="text-sm text-gray-600">Guidance and reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Data & Digital</h3>
                    <p className="text-sm text-gray-600">Admin and tech solutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Code className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Programming</h3>
                    <p className="text-sm text-gray-600">Web, APIs, data & AI</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Scholarship Support</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Entrepreneurship</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Document Reviews</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Curriculum & Capacity</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-600 mb-4">Course</Badge>
            <h2 className="text-4xl font-bold text-gray-900">Explore Popular Courses</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src="/images/logo.jpg"
                  alt="Mathematics Course"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-orange-500 text-white">Mathematics</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Mathematics for Grade 9-12</h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.9)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">2.3k Students</span>
                  </div>
                  <span className="font-bold text-lg">$49</span>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src="/images/logo.jpg"
                  alt="English Course"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">English</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">English for Grade 9-12</h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.8)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">1.8k Students</span>
                  </div>
                  <span className="font-bold text-lg">$39</span>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src="/images/logo.jpg"
                  alt="Social Science Course"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-blue-500 text-white">Social Science</Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Social Science for Grade 9-12</h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.7)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">1.5k Students</span>
                  </div>
                  <span className="font-bold text-lg">$45</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button className="bg-[#FF6652] hover:bg-[#e55a4a] text-white px-8 py-3">View All Courses</Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Hybrid, technology‑driven learning and services</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-700">Technology Enhanced Learning</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-700">High Quality Video & Audio Classes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-700">Flexible Online and Offline Learning</span>
                </div>
              </div>
              <Button className="bg-[#FF6652] hover:bg-[#e55a4a] text-white px-8 py-3">Join & Start</Button>
            </div>

            <div className="relative">
              <Image
                src="/images/logo.jpg"
                alt="Learning statistics"
                width={500}
                height={400}
                className="rounded-2xl"
              />
              <div className="absolute top-8 right-8 bg-white rounded-lg p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#245D51]">85</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
              <div className="absolute bottom-8 left-8 bg-white rounded-lg p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#245D51]">2K</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-orange-100 text-orange-600 mb-4">Partner</Badge>
            <h2 className="text-3xl font-bold text-gray-900">Our Partners</h2>
          </div>

          <div className="flex items-center justify-center gap-12 flex-wrap opacity-60">
            <div className="text-2xl font-bold text-gray-400">Progate</div>
            <div className="text-2xl font-bold text-gray-400">Stanford</div>
            <div className="text-2xl font-bold text-gray-400">Gojek</div>
            <div className="text-2xl font-bold text-gray-400">McGill</div>
            <div className="text-2xl font-bold text-gray-400">Udemy</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-600 mb-4">Testimonial</Badge>
            <h2 className="text-4xl font-bold text-gray-900">Our Happy Clients</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8">
              <CardContent className="pt-0">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "Askuala has transformed my learning experience. The interactive classes and personalized approach
                  helped me achieve my academic goals."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-orange-600">DF</span>
                  </div>
                  <div>
                    <div className="font-semibold">David F.</div>
                    <div className="text-sm text-gray-500">Student</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent className="pt-0">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "The quality of education and support from instructors is exceptional. I highly recommend Askuala to
                  anyone looking to enhance their skills."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-[#245D51]">NH</span>
                  </div>
                  <div>
                    <div className="font-semibold">Nabeel H.</div>
                    <div className="text-sm text-gray-500">Student</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent className="pt-0">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "Flexible learning options and comprehensive course materials make Askuala the perfect platform for
                  busy professionals like me."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-purple-600">MA</span>
                  </div>
                  <div>
                    <div className="font-semibold">Mikyaa A.</div>
                    <div className="text-sm text-gray-500">Professional</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

     
    </div>
  )
}

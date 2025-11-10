"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, BookOpen, Users, Monitor, Lightbulb, Briefcase, Plus, ArrowRight, GraduationCap } from "lucide-react"
import { toast } from "sonner"

interface UserData {
  userId: string
  firstName: string
  lastName: string
  email: string
  role: string
}

interface Course {
  id: string
  type: string
  title: string
  description: string
  status: string
  createdAt: string
  details?: any
  icon: React.ElementType
}

const courseTypes = {
  tutor: {
    title: "Tutor Profile",
    description: "Share your knowledge and help students succeed",
    icon: BookOpen,
    color: "bg-blue-500",
    path: "/register/tutor"
  },
  tutee: {
    title: "Student Profile", 
    description: "Find the perfect tutor to help you learn",
    icon: Users,
    color: "bg-green-500",
    path: "/register/tutee"
  },
  training: {
    title: "Training Program",
    description: "Enhance your skills with professional training",
    icon: Monitor,
    color: "bg-purple-500",
    path: "/register/training"
  },
  research: {
    title: "Research Consultation",
    description: "Get expert guidance for your research projects",
    icon: Lightbulb,
    color: "bg-orange-500",
    path: "/register/research"
  },
  entrepreneurship: {
    title: "Entrepreneurship Program",
    description: "Turn your business ideas into reality",
    icon: Briefcase,
    color: "bg-red-500",
    path: "/register/entrepreneurship"
  }
}

export default function CoursesPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  // Fetch user data and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('/api/auth/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          if (userData.user && userData.user.userId) {
            setUser(userData.user)
            setShowAuthPrompt(false)
            
            // Fetch user's courses
            await fetchUserCourses(userData.user.userId)
          } else {
            setUser(null)
            setShowAuthPrompt(true)
          }
        } else {
          setUser(null)
          setShowAuthPrompt(true)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setUser(null)
        setShowAuthPrompt(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const fetchUserCourses = async (userId: string) => {
    try {
       const response = await fetch(`/api/my-courses/${userId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
       })
       const data = await response.json()
       const rawCourses = data.courses
       console.log("🚀 ~ fetchUserCourses ~ rawCourses:", rawCourses)
       
       // Map raw database data to course format
       const mappedCourses: Course[] = rawCourses.map((course: any) => {
         let courseData: Course = {
           id: '',
           type: '',
           title: '',
           description: '',
           status: 'Active',
           createdAt: course.created_at,
           details: course,
           icon: User
         }

         if (course.tutor_id) {
           const subjects = Array.isArray(course.subjects) ? course.subjects : (typeof course.subjects === 'string' ? JSON.parse(course.subjects) : [])
           const gradeLevels = Array.isArray(course.grade_levels) ? course.grade_levels : (typeof course.grade_levels === 'string' ? JSON.parse(course.grade_levels) : [])
           courseData = {
             id: course.tutor_id,
             type: 'tutor',
             title: 'Tutor Profile',
             description: `Teaching ${subjects.join(', ')} for grades ${gradeLevels.join(', ')}`,
             status: 'Active',
             createdAt: course.created_at,
             details: course,
             icon: BookOpen
           }
         } else if (course.tutee_id) {
           const subjects = Array.isArray(course.subjects) ? course.subjects : (typeof course.subjects === 'string' ? JSON.parse(course.subjects) : [])
           courseData = {
             id: course.tutee_id,
             type: 'tutee',
             title: 'Student Profile',
             description: `Learning ${subjects.join(', ')} at grade ${course.grade_level}`,
             status: 'Active',
             createdAt: course.created_at,
             details: course,
             icon: GraduationCap
           }
        } else if (course.training_id) {
          const trainingTypes = Array.isArray(course.training_types)
            ? course.training_types
            : (typeof course.training_types === 'string'
                ? (() => { try { return JSON.parse(course.training_types) } catch { return [] } })()
                : (course.training_type ? [course.training_type] : []))
          const trainingLabel = trainingTypes.length > 0 ? trainingTypes.join(', ') : 'Training'
          courseData = {
            id: course.training_id,
            type: 'training',
            title: 'Training Program',
            description: `${trainingLabel} (${course.delivery_method || 'N/A'})`,
            status: 'Active',
            createdAt: course.created_at,
            details: course,
            icon: Monitor
          }
         } else if (course.research_id) {
           courseData = {
             id: course.research_id,
             type: 'research',
             title: 'Research Consultation',
             description: `${course.research_level} research in ${course.study_area}`,
             status: 'Active',
             createdAt: course.created_at,
             details: course,
             icon: Lightbulb
           }
         } else if (course.entrepreneurship_id) {
           courseData = {
             id: course.entrepreneurship_id,
             type: 'entrepreneurship',
             title: 'Entrepreneurship Program',
             description: 'Business development and consultation',
             status: 'Active',
             createdAt: course.created_at,
             details: course,
             icon: Briefcase
           }
         }

         // Ensure we always return a valid course object
         if (!courseData.id) {
           console.warn('Invalid course data:', course)
           return null
         }
         
         return courseData
       })

       // Filter out any null values
       const validCourses = mappedCourses.filter(course => course !== null)
       setCourses(validCourses)
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load your courses')
    }
  }

  const getAvailableCourses = () => {
    const registeredTypes = courses.map(course => course.type)
    return Object.entries(courseTypes).filter(([type]) => !registeredTypes.includes(type))
  }

  const getSuggestedCourses = () => {
    const registeredTypes = courses.map(course => course.type)
    const suggestions = []
    
    // Suggest complementary courses based on what they have
    if (registeredTypes.includes('tutor') && !registeredTypes.includes('training')) {
      suggestions.push(courseTypes.training)
    }
    if (registeredTypes.includes('tutee') && !registeredTypes.includes('tutor')) {
      suggestions.push(courseTypes.tutor)
    }
    if (registeredTypes.includes('research') && !registeredTypes.includes('training')) {
      suggestions.push(courseTypes.training)
    }
    if (registeredTypes.includes('entrepreneurship') && !registeredTypes.includes('training')) {
      suggestions.push(courseTypes.training)
    }
    
    return suggestions
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#245D51] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (showAuthPrompt || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <section
          className="text-white px-4 sm:px-6 min-h-[40svh] md:min-h-[50svh] relative pt-20 md:pt-28"
          style={{ backgroundImage: "url(/images/hero-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative max-w-7xl mx-auto min-h-[calc(50svh_-_7rem)] flex items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">My Courses</h1>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="lg:w-24 lg:h-24 w-16 h-16 bg-[#FF6652]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="lg:w-12 lg:h-12 w-8 h-8 text-[#FF6652]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
              <p className="text-gray-600 mb-8">
                Please sign in to view your courses and enroll in new programs.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => window.location.href = '/auth/signin'}
                  className="bg-[#245D51] hover:bg-[#1e4a42] text-white"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => window.location.href = '/auth/signup'}
                  variant="outline"
                  className="border-[#FF6652] text-[#FF6652] hover:bg-[#FF6652]/5"
                >
                  Create Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const availableCourses = getAvailableCourses()
  const suggestedCourses = getSuggestedCourses()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <section
        className="text-white px-4 sm:px-6 min-h-[40svh] md:min-h-[50svh] relative pt-20 md:pt-28"
        style={{ backgroundImage: "url(/images/hero-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto min-h-[calc(50svh_-_7rem)] flex items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">My Courses</h1>
            <p className="text-base sm:text-lg md:text-xl">Welcome back, {user.firstName}!</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* User Information */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="lg:w-20 lg:h-20 w-16 h-16 bg-[#245D51] rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Courses */}
        <div className="my-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Your Active Programs</h2>
          {courses.length === 0 ? (
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-[#245D51]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-[#245D51]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">No Programs Yet</h3>
                <p className="text-gray-600 mb-8">
                  You haven't enrolled in any programs yet. Explore our available courses below!
                </p>
                <Button
                  onClick={() => window.location.href = '/register'}
                  className="bg-[#245D51] hover:bg-[#1e4a42] text-white"
                >
                  Browse Programs
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const courseType = courseTypes[course.type as keyof typeof courseTypes]
                const IconComponent = course.icon || courseType?.icon || User
                return (
                  <Card key={course.id} className="border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${courseType?.color || 'bg-[#245D51]'} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-md font-semibold text-gray-800">{course?.title}</CardTitle>
                          <Badge variant="secondary" className="text-xs">{course.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">{course?.description}</p>
                      <p className="text-xs text-gray-500">
                        Enrolled: {new Date(course?.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Available Courses */}
        {availableCourses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Programs</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map(([type, courseType]) => {
                const IconComponent = courseType.icon
                return (
                  <Card key={type} className="border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${courseType.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-md font-semibold text-gray-800">{courseType.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">Available</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">{courseType.description}</p>
                      <Button
                        onClick={() => window.location.href = courseType.path}
                        className="w-full bg-[#245D51] hover:bg-[#1e4a42] text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Enroll Now
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Suggested Courses */}
        {suggestedCourses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended for You</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedCourses.map((courseType) => {
                const IconComponent = courseType.icon
                return (
                  <Card key={courseType.title} className="border-0 bg-gradient-to-br from-[#FF6652]/5 to-[#245D51]/5 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${courseType.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">{courseType.title}</CardTitle>
                          <Badge variant="outline" className="text-xs border-[#FF6652] text-[#FF6652]">Recommended</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">{courseType.description}</p>
                      <Button
                        onClick={() => window.location.href = courseType.path}
                        className="w-full bg-gradient-to-r from-[#FF6652] to-[#245D51] hover:from-[#e55a47] hover:to-[#1e4a42] text-white"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Explore Program
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

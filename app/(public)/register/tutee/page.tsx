"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Clock, Calendar, Monitor, Users, User } from "lucide-react"
import { toast } from "sonner"

const gradeLevels = ["KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
const subjects = ["Maths", "Physics", "Chemistry", "Biology", "English", "Science", "ALL"]
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const TuteeSchema = z.object({
  age: z.number().min(5, "Must be at least 5 years old").max(18, "Must be under 18 years old"),
  gender: z.enum(["male", "female"], { required_error: "Please select your gender" }),
  gradeLevel: z.string().min(1, "Please select your grade level"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  availableDays: z.array(z.string()).min(1, "Select at least one day"),
  deliveryMethod: z.enum(["online", "face-to-face", "online-&-face-to-face"], { required_error: "Please select delivery method" }),
})

type TuteeFormValues = z.infer<typeof TuteeSchema>

export default function TuteeRegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>("")
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [user, setUser] = useState<{ userId: string; firstName: string; lastName: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TuteeFormValues>({ 
    resolver: zodResolver(TuteeSchema),
    defaultValues: {
      gradeLevel: "",
      subjects: [],
      availableDays: [],
    }
  })

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          if (data.user && data.user.userId && data.user.firstName && data.user.lastName) {
            setUser(data.user)
            setShowAuthPrompt(false)
          } else {
            setUser(null)
            setShowAuthPrompt(true)
          }
        } else {
          setUser(null)
          setShowAuthPrompt(true)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
        setShowAuthPrompt(true)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const selectGradeLevel = (grade: string) => {
    setSelectedGradeLevel(grade)
    setValue("gradeLevel", grade)
  }

  const toggleSubject = (subject: string) => {
    const newSelection = selectedSubjects.includes(subject)
      ? selectedSubjects.filter(s => s !== subject)
      : [...selectedSubjects, subject]
    setSelectedSubjects(newSelection)
    setValue("subjects", newSelection)
  }

  const toggleDay = (day: string) => {
    const newSelection = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day]
    setSelectedDays(newSelection)
    setValue("availableDays", newSelection)
  }

  const onSubmit = async (data: TuteeFormValues) => {
    // Check if user is authenticated
    if (!user || !user.userId) {
      setShowAuthPrompt(true)
      toast.error("Please sign in to register as a tutee")
      return
    }

    try {
      // Submit tutee profile
      const payload = {
        ...data,
        userId: user.userId,
      }

      const response = await fetch('/api/tutees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        console.log("Tutee registration successful:", payload)
        toast.success("Registration successful! Welcome as a tutee.")
    setSubmitted(true)
    reset()
        setSelectedGradeLevel("")
        setSelectedSubjects([])
        setSelectedDays([])
        setTimeout(() => {
          setSubmitted(false)
          window.location.href = '/my-courses'
        }, 2000)
      } else {
        const error = await response.json()
        if (error.details) {
          // Validation errors
          error.details.forEach((err: any) => {
            toast.error(err.message)
          })
        } else {
          toast.error("Registration failed. Please try again.")
        }
        console.error("Registration failed:", error)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <section
        className="text-white px-6 min-h-[50svh] relative pt-28"
        style={{ backgroundImage: "url(/images/hero-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto min-h-[calc(50svh_-_7rem)] flex items-center">
          <h1 className="text-5xl font-bold">Tutee Registration</h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-800">Join as a Student</CardTitle>
            <p className="text-gray-600 mt-2">Find the perfect tutor to help you succeed</p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {showAuthPrompt && (
              <div className="mb-6 p-4 bg-[#FF6652]/10 border border-[#FF6652]/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#FF6652]/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#FF6652]" />
                  </div>
              <div>
                    <p className="text-[#FF6652] font-medium">Authentication Required</p>
                    <p className="text-sm text-gray-600">Please create an account or sign in to continue with tutee registration.</p>
                  </div>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* User Information Display */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#245D51]/20 pb-2">Your Information</h3>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-[#245D51] border-t-transparent rounded-full animate-spin" />
              </div>
                ) : user ? (
                  <div className="bg-[#245D51]/5 border border-[#245D51]/20 rounded-lg p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#245D51] rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                </div>
                <div>
                        <h4 className="text-xl font-semibold text-gray-800">
                          {user.firstName} {user.lastName}
                        </h4>
                        <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              </div>
                ) : showAuthPrompt ? (
                  <div className="bg-[#FF6652]/5 border border-[#FF6652]/20 rounded-lg p-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-[#FF6652]/10 rounded-full flex items-center justify-center mx-auto">
                        <User className="w-8 h-8 text-[#FF6652]" />
                </div>
                <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Account Required</h4>
                        <p className="text-gray-600 mb-4">
                          You need to create an account or sign in to register as a tutee.
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button
                            onClick={() => window.location.href = '/auth/signup'}
                            className="bg-[#245D51] hover:bg-[#1e4a42] text-white"
                          >
                            Create Account
                          </Button>
                          <Button
                            onClick={() => window.location.href = '/auth/signin'}
                            variant="outline"
                            className="border-[#FF6652] text-[#FF6652] hover:bg-[#FF6652]/5"
                          >
                            Sign In
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Tutee Profile Information */}
              <div className={`space-y-6 ${!user ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#FF6652]/20 pb-2">Student Profile</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Age *</Label>
                    <Input 
                      type="number" 
                      {...register("age", { valueAsNumber: true })} 
                      placeholder="Your age" 
                      disabled={!user}
                      className="border-gray-300 focus:border-[#245D51] focus:ring-[#245D51] disabled:bg-gray-100"
                    />
                    {errors.age && <p className="text-sm text-[#FF6652]">{errors.age.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Gender *</Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} disabled={!user}>
                          <SelectTrigger className="border-gray-300 focus:border-[#245D51] focus:ring-[#245D51] disabled:bg-gray-100">
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.gender && <p className="text-sm text-[#FF6652]">{errors.gender.message}</p>}
                  </div>
                </div>
              </div>

              {/* Grade Level */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#245D51]/20 pb-2">Current Grade Level *</h3>
                <p className="text-sm text-gray-600">Select your current grade level</p>
                <div className="flex flex-wrap gap-3">
                  {gradeLevels.map((grade) => (
                    <Badge
                      key={grade}
                      variant={selectedGradeLevel === grade ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                        selectedGradeLevel === grade
                          ? "bg-[#245D51] text-white hover:bg-[#1e4a42]"
                          : "border-[#245D51]/30 text-[#245D51] hover:bg-[#245D51]/5"
                      }`}
                      onClick={() => selectGradeLevel(grade)}
                    >
                      {grade}
                    </Badge>
                  ))}
                </div>
                {errors.gradeLevel && <p className="text-sm text-[#FF6652]">{errors.gradeLevel.message}</p>}
              </div>

              {/* Subjects */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#FF6652]/20 pb-2">Subjects You Need Help With *</h3>
                <p className="text-sm text-gray-600">Select the subjects you need tutoring in (you can select multiple)</p>
                <div className="flex flex-wrap gap-3">
                  {subjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                        selectedSubjects.includes(subject)
                          ? "bg-[#FF6652] text-white hover:bg-[#e55a47]"
                          : "border-[#FF6652]/30 text-[#FF6652] hover:bg-[#FF6652]/5"
                      }`}
                      onClick={() => toggleSubject(subject)}
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
                {errors.subjects && <p className="text-sm text-[#FF6652]">{errors.subjects.message}</p>}
              </div>

              {/* Delivery Method */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#FF6652]/20 pb-2">Preferred Delivery Method *</h3>
                <p className="text-sm text-gray-600">Choose how you prefer to receive tutoring sessions</p>
                <Controller
                  name="deliveryMethod"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="cursor-pointer flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Online
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="face-to-face" id="face-to-face" />
                        <Label htmlFor="face-to-face" className="cursor-pointer flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Face-to-Face
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online-&-face-to-face" id="online-and-face-to-face" />
                        <Label htmlFor="online-and-face-to-face" className="cursor-pointer flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Online & Face-to-Face
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.deliveryMethod && <p className="text-sm text-[#FF6652]">{errors.deliveryMethod.message}</p>}
              </div>

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#245D51]/20 pb-2">Preferred Schedule *</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Preferred Start Time
                    </Label>
                    <Input 
                      type="time" 
                      {...register("startTime")} 
                      className="border-gray-300 focus:border-[#245D51] focus:ring-[#245D51]"
                    />
                    {errors.startTime && <p className="text-sm text-[#FF6652]">{errors.startTime.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Preferred End Time
                    </Label>
                    <Input 
                      type="time" 
                      {...register("endTime")} 
                      className="border-gray-300 focus:border-[#245D51] focus:ring-[#245D51]"
                    />
                    {errors.endTime && <p className="text-sm text-[#FF6652]">{errors.endTime.message}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Available Days
                  </Label>
                  <p className="text-sm text-gray-600">Select the days you're available for tutoring (you can select multiple)</p>
                  <div className="flex flex-wrap gap-3">
                    {daysOfWeek.map((day) => (
                      <Badge
                        key={day}
                        variant={selectedDays.includes(day) ? "default" : "outline"}
                        className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                          selectedDays.includes(day)
                            ? "bg-[#FF6652] text-white hover:bg-[#e55a47]"
                            : "border-[#FF6652]/30 text-[#FF6652] hover:bg-[#FF6652]/5"
                        }`}
                        onClick={() => toggleDay(day)}
                      >
                        {day}
                      </Badge>
                    ))}
                  </div>
                  {errors.availableDays && <p className="text-sm text-[#FF6652]">{errors.availableDays.message}</p>}
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !user} 
                  className="w-full bg-gradient-to-r from-[#245D51] to-[#FF6652] hover:from-[#1e4a42] hover:to-[#e55a47] text-white py-3 text-lg font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : !user ? (
                    "Please Sign In First"
                  ) : (
                    "Submit Application"
                  )}
                </Button>
                {submitted && (
                  <div className="mt-4 p-4 bg-[#245D51]/10 border border-[#245D51]/20 rounded-lg text-center">
                    <p className="text-[#245D51] font-medium">Application submitted successfully!</p>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}




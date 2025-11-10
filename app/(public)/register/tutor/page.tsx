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
import { Upload, X, Clock, Calendar, Monitor, Users, User } from "lucide-react"
import { toast } from "sonner"

export const dynamic = "force-dynamic"

const gradeLevels = ["KG", "1-4", "5-8", "9-12"]
const subjects = ["Maths", "Physics", "Chemistry", "Biology", "English", "Science", "ALL"]
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const isFileList = (v: unknown): v is FileList => {
  const FileListCtor = typeof globalThis !== "undefined" ? (globalThis as any).FileList : undefined
  return typeof FileListCtor !== "undefined" && v instanceof FileListCtor
}

const TutorSchema = z.object({
  age: z.number(),
  gender: z.enum(["male", "female"], { required_error: "Please select your gender" }),
  gradeLevels: z.array(z.string()).min(1, "Select at least one grade level"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time (HH:MM)"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time (HH:MM)"),
  availableDays: z.array(z.string()).min(1, "Select at least one day"),
  deliveryMethod: z.enum(["online", "face-to-face", "online-&-face-to-face"], { required_error: "Please select delivery method" }),
  cv: z
    .any()
    .refine((files) => isFileList(files) && files.length > 0, "CV is required")
    .refine((files) => !isFileList(files) || files[0]?.type === "application/pdf", "PDF only")
    .refine((files) => !isFileList(files) || files[0]?.size <= 5 * 1024 * 1024, "Max 5MB"),
}).superRefine((val, ctx) => {
  const startStr = (val.startTime ?? '').trim()
  const endStr = (val.endTime ?? '').trim()
  const timeRe = /^\d{2}:\d{2}$/
  if (!timeRe.test(startStr) || !timeRe.test(endStr)) {
    // Let the field-level regex validations handle malformed times
    return
  }
  const [sh, sm] = startStr.split(":").map((n) => parseInt(n, 10))
  const [eh, em] = endStr.split(":").map((n) => parseInt(n, 10))
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) {
    return
  }
  const startMin = sh * 60 + sm
  const endMin = eh * 60 + em
  if (endMin <= startMin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End time must be after start time",
      path: ["endTime"],
    })
  }
})

type TutorFormValues = z.infer<typeof TutorSchema>

export default function TutorRegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [user, setUser] = useState<{ userId: string; firstName: string; lastName: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  
  console.log("🚀 ~ TutorRegisterPage ~ user:", user)
  console.log("🚀 ~ TutorRegisterPage ~ loading:", loading)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<TutorFormValues>({ 
    resolver: zodResolver(TutorSchema),
    defaultValues: {
      gradeLevels: [],
      subjects: [],
      availableDays: [],
    }
  })

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        console.log("🚀 ~ fetchUser ~ response.ok:", response.ok)
        if (response.ok) {
          const data = await response.json()
          console.log("🚀 ~ fetchUser ~ data:", data)
          if (data.user && data.user.userId && data.user.firstName && data.user.lastName) {
            setUser(data.user) // The API returns { user: {...} }
            setShowAuthPrompt(false)
          } else {
            console.log("🚀 ~ fetchUser ~ user data incomplete:", data.user)
            setUser(null)
            setShowAuthPrompt(true)
          }
        } else {
          console.log("🚀 ~ fetchUser ~ response not ok:", response.status)
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

  const toggleGradeLevel = (grade: string) => {
    const newSelection = selectedGradeLevels.includes(grade)
      ? selectedGradeLevels.filter(g => g !== grade)
      : [...selectedGradeLevels, grade]
    setSelectedGradeLevels(newSelection)
    setValue("gradeLevels", newSelection)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCvFile(file)
      setValue("cv", e.target.files as FileList)
    }
  }

  const removeFile = () => {
    setCvFile(null)
    setValue("cv", undefined as any)
  }

  const onSubmit = async (data: TutorFormValues) => {
    // Check if user is authenticated
    if (!user || !user.userId) {
      setShowAuthPrompt(true)
      return
    }

    try {
      // Upload CV first
      const formData = new FormData()
      if (cvFile) {
        formData.append('cv', cvFile)
      }

      const uploadResponse = await fetch('/api/tutors/upload-cv', {
        method: 'POST',
        body: formData,
      })

      let cvPath = ''
      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json()
        cvPath = uploadResult.data.filePath
      }

      // Submit tutor profile
    const payload = {
      ...data,
        cvPath,
        userId: user.userId, // Use the actual user ID from session
      }

      const response = await fetch('/api/tutors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        console.log("Tutor registration successful:", payload)
        toast.success("Registration successful! Welcome as a tutor.")
    setSubmitted(true)
    reset()
        setSelectedGradeLevels([])
        setSelectedSubjects([])
        setSelectedDays([])
        setCvFile(null)
        setTimeout(() => {
          setSubmitted(false)
          window.location.href = '/my-courses'
        }, 2000)
      } else {
        const error = await response.json()
        if (error?.details && Array.isArray(error.details)) {
          error.details.forEach((err: any) => { if (err?.message) toast.error(err.message) })
        } else {
          toast.error(error?.error || "Registration failed. Please try again.")
        }
        console.error("Registration failed:", error)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
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
          <h1 className="text-5xl font-bold">Tutor Registration</h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-800">Join as a Tutor</CardTitle>
            <p className="text-gray-600 mt-2">Share your knowledge and help students succeed</p>
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
                    <p className="text-sm text-gray-600">Please create an account or sign in to continue with tutor registration.</p>
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
                          You need to create an account or sign in to register as a tutor.
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

              {/* Tutor Profile Information */}
              <div className={`space-y-6 ${!user ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#FF6652]/20 pb-2">Tutor Profile</h3>
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

              {/* Grade Levels */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#245D51]/20 pb-2">Grade Levels *</h3>
                <p className="text-sm text-gray-600">Select the grade levels you can teach (you can select multiple)</p>
                <div className="flex flex-wrap gap-3">
                  {gradeLevels.map((grade) => (
                    <Badge
                      key={grade}
                      variant={selectedGradeLevels.includes(grade) ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                        selectedGradeLevels.includes(grade)
                          ? "bg-[#245D51] text-white hover:bg-[#1e4a42]"
                          : "border-[#245D51]/30 text-[#245D51] hover:bg-[#245D51]/5"
                      }`}
                      onClick={() => toggleGradeLevel(grade)}
                    >
                      {grade}
                    </Badge>
                  ))}
                </div>
                {errors.gradeLevels && <p className="text-sm text-[#FF6652]">{errors.gradeLevels.message}</p>}
              </div>

              {/* Subjects */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#FF6652]/20 pb-2">Subjects *</h3>
                <p className="text-sm text-gray-600">Select the subjects you can teach (you can select multiple)</p>
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
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#FF6652]/20 pb-2">Delivery Method *</h3>
                <p className="text-sm text-gray-600">Choose how you prefer to deliver tutoring sessions</p>
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
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#245D51]/20 pb-2">Schedule *</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Start Time
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
                      End Time
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
                  <p className="text-sm text-gray-600">Select the days you're available (you can select multiple)</p>
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

              {/* CV Upload */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#245D51]/20 pb-2">CV Upload *</h3>
                <div className="space-y-4">
                  {!cvFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#245D51] transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <Label htmlFor="cv" className="cursor-pointer">
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-700">Upload your CV</p>
                          <p className="text-sm text-gray-500">PDF only, max 5MB</p>
                        </div>
                      </Label>
                      <Input
                        id="cv"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-[#245D51]/20 bg-[#245D51]/5 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#FF6652]/10 rounded-lg flex items-center justify-center">
                          <span className="text-[#FF6652] font-bold text-sm">PDF</span>
              </div>
              <div>
                          <p className="font-medium text-gray-800">{cvFile.name}</p>
                          <p className="text-sm text-gray-500">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-[#FF6652] hover:text-[#e55a47] hover:bg-[#FF6652]/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {errors.cv?.message ? <p className="text-sm text-[#FF6652]">{String(errors.cv.message)}</p> : null}
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




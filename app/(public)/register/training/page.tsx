"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
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
import { Monitor, Users, User } from "lucide-react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { services as allServices } from "@/app/(public)/services/data"

const trainingOptions = [
  "Software",
  "Coding",
  "Kaizen",
  "Accounting",
  "Graphics",
  "Video Editing",
  "FX Trading",
  "UX/UI",
  "Digital Marketing",
]

const TrainingSchema = z.object({
  age: z.number(),
  gender: z.enum(["male", "female"], { required_error: "Please select your gender" }),
  trainingTypes: z.array(z.string()).min(1, "Select at least one training type"),
  deliveryMethod: z.enum(["online", "face-to-face", "online-&-face-to-face"], { required_error: "Please select delivery method" }),
})

type TrainingFormValues = z.infer<typeof TrainingSchema>

function TrainingRegisterContent() {
  const [submitted, setSubmitted] = useState(false)
  const [selectedTrainingTypes, setSelectedTrainingTypes] = useState<string[]>([])
  const [user, setUser] = useState<{ userId: string; firstName: string; lastName: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
	const searchParams = useSearchParams()
	const serviceSlug = searchParams.get("service") || ""
	const serviceData = useMemo(() => allServices.find(s => s.slug === serviceSlug) || null, [serviceSlug])
	const availableTrainingOptions = useMemo(() => (serviceData ? [serviceData.title] : trainingOptions), [serviceData])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TrainingFormValues>({ 
    resolver: zodResolver(TrainingSchema),
    defaultValues: {
      trainingTypes: [],
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

	// If navigating from a specific service, preselect and lock training type to that service
	useEffect(() => {
		if (serviceData) {
			const onlyType = serviceData.title
			setSelectedTrainingTypes([onlyType])
			setValue("trainingTypes", [onlyType])
		}
	}, [serviceData, setValue])

  const toggleTrainingType = (type: string) => {
    const next = selectedTrainingTypes.includes(type)
      ? selectedTrainingTypes.filter(t => t !== type)
      : [...selectedTrainingTypes, type]
    setSelectedTrainingTypes(next)
    setValue("trainingTypes", next)
  }

  const onSubmit = async (data: TrainingFormValues) => {
    // Check if user is authenticated
    if (!user || !user.userId) {
      setShowAuthPrompt(true)
      toast.error("Please sign in to register for training")
      return
    }

    try {
      // Submit training profile
      const payload = {
        ...data,
        userId: user.userId,
      }

      const response = await fetch('/api/training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        console.log("Training registration successful:", payload)
        toast.success("Registration successful! Welcome to our training program.")
        setSubmitted(true)
        reset()
        setSelectedTrainingTypes([])
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
					<h1 className="text-5xl font-bold">{serviceData ? serviceData.title : "Training Registration"}</h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
						<CardTitle className="text-3xl font-bold text-gray-800">
							{serviceData ? `Request ${serviceData.title}` : "Join Our Training Program"}
						</CardTitle>
						<p className="text-gray-600 mt-2">
							{serviceData ? serviceData.shortDescription : "Enhance your skills with professional training"}
						</p>
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
                    <p className="text-sm text-gray-600">Please create an account or sign in to continue with training registration.</p>
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
                          You need to create an account or sign in to register for training.
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

              {/* Training Profile Information */}
              <div className={`space-y-6 ${!user ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#FF6652]/20 pb-2">Training Profile</h3>
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

              {/* Training Types */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#245D51]/20 pb-2">Training Types *</h3>
					{!serviceData && (
						<p className="text-sm text-gray-600">Select the type(s) of training you're interested in (you can select multiple)</p>
					)}
                <div className="flex flex-wrap gap-3">
						{availableTrainingOptions.map((type) => (
                    <Badge
                      key={type}
                      variant={selectedTrainingTypes.includes(type) ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                        selectedTrainingTypes.includes(type)
                          ? "bg-[#245D51] text-white hover:bg-[#1e4a42]"
                          : "border-[#245D51]/30 text-[#245D51] hover:bg-[#245D51]/5"
                      }`}
                      onClick={() => toggleTrainingType(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
                {errors.trainingTypes && <p className="text-sm text-[#FF6652]">{errors.trainingTypes.message}</p>}
              </div>

              {/* Delivery Method */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#FF6652]/20 pb-2">Delivery Method *</h3>
                <p className="text-sm text-gray-600">Choose how you prefer to receive the training</p>
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

export default function TrainingRegisterPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
					<section
						className="text-white px-6 min-h-[50svh] relative pt-28"
						style={{ backgroundImage: "url(/images/hero-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
					>
						<div className="absolute inset-0 bg-black/40" />
						<div className="relative max-w-7xl mx-auto min-h-[calc(50svh_-_7rem)] flex items-center">
							<h1 className="text-5xl font-bold">Training Registration</h1>
						</div>
					</section>
					<div className="max-w-4xl mx-auto px-6 py-12">
						<div className="w-10 h-10 border-2 border-[#245D51] border-t-transparent rounded-full animate-spin mx-auto my-20" />
					</div>
				</div>
			}
		>
			<TrainingRegisterContent />
		</Suspense>
	)
}




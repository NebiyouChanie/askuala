"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BookOpen, GraduationCap, Monitor, Lightbulb, Briefcase, Search, User, Mail, Phone, MapPin, Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

interface User {
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
}

 

const courseTypes = [
  {
    id: 'tutors',
    name: 'Tutor Registration',
    icon: BookOpen,
    color: 'bg-blue-500',
    description: 'Register a new tutor'
  },
  {
    id: 'tutees',
    name: 'Tutee Registration',
    icon: GraduationCap,
    color: 'bg-green-500',
    description: 'Register a new tutee'
  },
  {
    id: 'training',
    name: 'Training Registration',
    icon: Monitor,
    color: 'bg-purple-500',
    description: 'Register for training program'
  },
  {
    id: 'research',
    name: 'Research Consultation',
    icon: Lightbulb,
    color: 'bg-yellow-500',
    description: 'Register for research consultation'
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    icon: Briefcase,
    color: 'bg-orange-500',
    description: 'Register for entrepreneurship program'
  }
]

const gradeLevels = ['KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const gradeLevelRanges = ['KG', '1-4', '5-8', '9-12']
const subjects = ['Maths', 'Physics', 'Chemistry', 'Biology', 'English', 'Science', 'ALL']
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const trainingTypes = ['Software', 'Coding', 'Kaizen', 'Accounting', 'Graphics', 'Video Editing', 'FX Trading', 'UX/UI', 'Digital Marketing']
const researchLevels = ['Undergraduate', 'Graduate', 'PhD', 'Professional']

export default function AdminRegistrationAddPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [searchEmail, setSearchEmail] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const AdminRegistrationSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(7, 'Phone is required'),
    address: z.string().min(1, 'Address is required'),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    confirmPassword: z.string().optional(),
    age: z
      .union([z.number().int().min(1, 'Age is required'), z.undefined()])
      .optional(),
    gender: z.string().optional(),
    gradeLevels: z.array(z.string()).optional(),
    gradeLevel: z.string().optional(),
    subjects: z.array(z.string()).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    availableDays: z.array(z.string()).optional(),
    deliveryMethod: z.string().optional(),
    trainingType: z.string().optional(),
    studyArea: z.string().optional(),
    researchLevel: z.string().optional(),
    cv: z.any().optional(),
  })

  type AdminRegistrationValues = z.infer<typeof AdminRegistrationSchema>

  const form = useForm<AdminRegistrationValues>({
    resolver: zodResolver(AdminRegistrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: '',
      age: undefined,
      gender: '',
      gradeLevels: [],
      gradeLevel: '',
      subjects: [],
      startTime: '',
      endTime: '',
      availableDays: [],
      deliveryMethod: '',
      trainingType: '',
      studyArea: '',
      researchLevel: '',
      cv: null,
    },
  })

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setGeneratedPassword(password)
    form.setValue('password', password, { shouldValidate: true })
    form.setValue('confirmPassword', password, { shouldValidate: true })
  }

  const searchUser = async () => {
    if (!searchEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/users/search?email=${encodeURIComponent(searchEmail)}`)
      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data.users || [])
        if (data.users && data.users.length === 0) {
          toast.error('No user found with this email')
        }
      } else {
        toast.error('Error searching for user')
      }
    } catch (error) {
      console.error('Error searching user:', error)
      toast.error('Error searching for user')
    } finally {
      setIsSearching(false)
    }
  }

  const selectUser = (user: User) => {
    setSelectedUser(user)
    form.setValue('firstName', user.first_name)
    form.setValue('lastName', user.last_name)
    form.setValue('email', user.email)
    form.setValue('phone', user.phone)
    form.setValue('address', user.address)
    setSearchResults([])
    setSearchEmail('')
    toast.success('User selected successfully')
  }

  const handleBackToCourses = () => {
    setSelectedCourse('')
    setSelectedUser(null)
    setGeneratedPassword('')
    form.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: '',
      age: undefined,
      gender: '',
      gradeLevels: [],
      gradeLevel: '',
      subjects: [],
      startTime: '',
      endTime: '',
      availableDays: [],
      deliveryMethod: '',
      trainingType: '',
      studyArea: '',
      researchLevel: '',
      cv: null,
    })
  }

  const onSubmit = async (data: AdminRegistrationValues) => {
    setLoading(true)
    setGeneratedPassword('') // Clear any previous success state
    try {
      let userId = selectedUser?.user_id

      // If no user selected, create new user
      if (!userId) {
        // Validate password presence and match for new user
        if (!data.password) {
          form.setError('password', { type: 'manual', message: 'Password is required' })
          throw new Error('Validation failed')
        }
        if (!data.confirmPassword) {
          form.setError('confirmPassword', { type: 'manual', message: 'Please confirm password' })
          throw new Error('Validation failed')
        }
        if (data.password !== data.confirmPassword) {
          form.setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' })
          throw new Error('Validation failed')
        }

        const userResponse = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            password: data.password,
            confirmPassword: data.confirmPassword
          })
        })

        const userData = await userResponse.json()
        
        // Check for 409 status code (email already in use)
        if (userResponse.status === 409) {
          toast.error('User with this email already exists. Please search for the user instead.')
          return
        }
        
        if (!userData.success) {
          throw new Error(userData.error || 'Failed to create user')
        }
        userId = userData.user_id
      }

      // Check if user already registered for this course
      const checkResponse = await fetch(`/api/${selectedCourse}?userId=${userId}`)
      const checkData = await checkResponse.json()
      
      if (checkData.success && checkData.data && checkData.data.length > 0) {
        toast.error(`User is already registered for ${selectedCourse}`)
        return
      }

      // Handle file upload for tutors
      let cvPath = ''
      if (selectedCourse === 'tutors' && data.cv) {
        const formDataFile = new FormData()
        formDataFile.append('cv', data.cv)
        
        const uploadResponse = await fetch('/api/tutors/upload-cv', {
          method: 'POST',
          body: formDataFile
        })
        
        const uploadData = await uploadResponse.json()
        if (!uploadData.success) {
          throw new Error(uploadData.error || 'Failed to upload CV')
        }
        cvPath = uploadData.data.filePath
      }

      // Prepare course data based on course type
      let courseData: any = {
        userId,
        age: data.age,
        gender: data.gender,
        deliveryMethod: data.deliveryMethod
      }

      // Add course-specific fields
      let hasValidationError = false
      switch (selectedCourse) {
        case 'tutors':
          // Conditional validations for tutors
          if (!data.age) { form.setError('age' as any, { type: 'manual', message: 'Age is required' }); hasValidationError = true }
          if (!data.gender) { form.setError('gender' as any, { type: 'manual', message: 'Gender is required' }); hasValidationError = true }
          if (!data.gradeLevels || data.gradeLevels.length === 0) { form.setError('gradeLevels' as any, { type: 'manual', message: 'Select at least one grade range' }); hasValidationError = true }
          if (!data.subjects || data.subjects.length === 0) { form.setError('subjects' as any, { type: 'manual', message: 'Select at least one subject' }); hasValidationError = true }
          if (!data.startTime) { form.setError('startTime' as any, { type: 'manual', message: 'Start time is required' }); hasValidationError = true }
          if (!data.endTime) { form.setError('endTime' as any, { type: 'manual', message: 'End time is required' }); hasValidationError = true }
          if (!data.availableDays || data.availableDays.length === 0) { form.setError('availableDays' as any, { type: 'manual', message: 'Select available days' }); hasValidationError = true }
          if (!data.deliveryMethod) { form.setError('deliveryMethod' as any, { type: 'manual', message: 'Select delivery method' }); hasValidationError = true }
          if (!data.cv) { form.setError('cv' as any, { type: 'manual', message: 'CV (PDF) is required' }); hasValidationError = true }
          courseData = {
            ...courseData,
            gradeLevels: data.gradeLevels,
            subjects: data.subjects,
            startTime: data.startTime,
            endTime: data.endTime,
            availableDays: data.availableDays,
            cvPath: cvPath
          }
          break
        case 'tutees':
          if (!data.age) { form.setError('age' as any, { type: 'manual', message: 'Age is required' }); hasValidationError = true }
          if (!data.gender) { form.setError('gender' as any, { type: 'manual', message: 'Gender is required' }); hasValidationError = true }
          if (!data.gradeLevel) { form.setError('gradeLevel' as any, { type: 'manual', message: 'Select a grade level' }); hasValidationError = true }
          if (!data.startTime) { form.setError('startTime' as any, { type: 'manual', message: 'Start time is required' }); hasValidationError = true }
          if (!data.endTime) { form.setError('endTime' as any, { type: 'manual', message: 'End time is required' }); hasValidationError = true }
          if (!data.availableDays || data.availableDays.length === 0) { form.setError('availableDays' as any, { type: 'manual', message: 'Select available days' }); hasValidationError = true }
          if (!data.deliveryMethod) { form.setError('deliveryMethod' as any, { type: 'manual', message: 'Select delivery method' }); hasValidationError = true }
          courseData = {
            ...courseData,
            gradeLevel: data.gradeLevel,
            subjects: data.subjects,
            startTime: data.startTime,
            endTime: data.endTime,
            availableDays: data.availableDays
          }
          break
        case 'training':
          if (!data.age) { form.setError('age' as any, { type: 'manual', message: 'Age is required' }); hasValidationError = true }
          if (!data.gender) { form.setError('gender' as any, { type: 'manual', message: 'Gender is required' }); hasValidationError = true }
          if (!data.trainingType) { form.setError('trainingType' as any, { type: 'manual', message: 'Select training type' }); hasValidationError = true }
          if (!data.deliveryMethod) { form.setError('deliveryMethod' as any, { type: 'manual', message: 'Select delivery method' }); hasValidationError = true }
          courseData = {
            ...courseData,
            trainingType: data.trainingType
          }
          break
        case 'research':
          if (!data.age) { form.setError('age' as any, { type: 'manual', message: 'Age is required' }); hasValidationError = true }
          if (!data.gender) { form.setError('gender' as any, { type: 'manual', message: 'Gender is required' }); hasValidationError = true }
          if (!data.studyArea) { form.setError('studyArea' as any, { type: 'manual', message: 'Study area is required' }); hasValidationError = true }
          if (!data.researchLevel) { form.setError('researchLevel' as any, { type: 'manual', message: 'Select research level' }); hasValidationError = true }
          if (!data.deliveryMethod) { form.setError('deliveryMethod' as any, { type: 'manual', message: 'Select delivery method' }); hasValidationError = true }
          courseData = {
            ...courseData,
            studyArea: data.studyArea,
            researchLevel: data.researchLevel
          }
          break
        case 'entrepreneurship':
          if (!data.age) { form.setError('age' as any, { type: 'manual', message: 'Age is required' }); hasValidationError = true }
          if (!data.gender) { form.setError('gender' as any, { type: 'manual', message: 'Gender is required' }); hasValidationError = true }
          // No additional fields needed
          break
      }

      if (hasValidationError) {
        throw new Error('Validation failed')
      }

      console.log('🚀 Sending course data:', courseData)
      
      const courseResponse = await fetch(`/api/${selectedCourse}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      })

      const courseResult = await courseResponse.json()
      
      if (!courseResult.success) {
        throw new Error(courseResult.error || 'Failed to register for course')
      }

      toast.success('Registration completed successfully!')
      setGeneratedPassword(data.password || '')
      
      // Reset form
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
        age: undefined,
        gender: '',
        gradeLevels: [],
        gradeLevel: '',
        subjects: [],
        startTime: '',
        endTime: '',
        availableDays: [],
        deliveryMethod: '',
        trainingType: '',
        studyArea: '',
        researchLevel: '',
        cv: null,
      })
      setSelectedUser(null)
      setSelectedCourse('')

    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const renderCourseForm = () => {
    if (!selectedCourse) return null

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {courseTypes.find(c => c.id === selectedCourse)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-700 font-medium">First Name</FormLabel>
                    <FormControl>
                      <Input id="firstName" className="bg-white border-gray-300 text-gray-900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-700 font-medium">Last Name</FormLabel>
                    <FormControl>
                      <Input id="lastName" className="bg-white border-gray-300 text-gray-900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <Input id="email" type="email" className="bg-white border-gray-300 text-gray-900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-700 font-medium">Phone</FormLabel>
                    <FormControl>
                      <Input id="phone" className="bg-white border-gray-300 text-gray-900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 space-y-2">
                    <FormLabel className="text-gray-700 font-medium">Address</FormLabel>
                    <FormControl>
                      <Input id="address" className="bg-white border-gray-300 text-gray-900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password fields for new users */}
            {!selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-semibold text-gray-900">Password</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generatePassword}
                    className="bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                  >
                    Generate Password
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input id="password" type={showPassword ? 'text' : 'password'} className="bg-white border-gray-300 text-gray-900 pr-10" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <Input id="confirmPassword" type="password" className="bg-white border-gray-300 text-gray-900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>
            )}
          </div>

          {/* Course-specific fields */}
          {selectedCourse === 'tutors' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Tutor Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Age</FormLabel>
                      <FormControl>
                        <Input
                          id="age"
                          type="number"
                          min="18"
                          max="65"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Gender</FormLabel>
                      <FormControl>
                        <select
                          id="gender"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label className="text-gray-700">Grade Levels</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {gradeLevelRanges.map((grade) => (
                    <Badge
                      key={grade}
                      variant={(form.getValues('gradeLevels') || []).includes(grade) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        (form.getValues('gradeLevels') || []).includes(grade)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        const current = form.getValues('gradeLevels') || []
                        const updated = current.includes(grade)
                          ? current.filter(g => g !== grade)
                          : [...current, grade]
                        form.setValue('gradeLevels', updated, { shouldValidate: true })
                      }}
                    >
                      {grade}
                    </Badge>
                  ))}
                </div>
                {form.formState.errors.gradeLevels && (
                  <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.gradeLevels.message || 'Select at least one grade range')}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-700">Subjects</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {subjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant={(form.getValues('subjects') || []).includes(subject) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        (form.getValues('subjects') || []).includes(subject)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        const current = form.getValues('subjects') || []
                        const updated = current.includes(subject)
                          ? current.filter(s => s !== subject)
                          : [...current, subject]
                        form.setValue('subjects', updated, { shouldValidate: true })
                      }}
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
                {form.formState.errors.subjects && (
                  <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.subjects.message || 'Select at least one subject')}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Start Time</FormLabel>
                      <FormControl>
                        <Input id="startTime" type="time" className="bg-white border-gray-300 text-gray-900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">End Time</FormLabel>
                      <FormControl>
                        <Input id="endTime" type="time" className="bg-white border-gray-300 text-gray-900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label className="text-gray-700">Available Days</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <Badge
                      key={day}
                      variant={(form.getValues('availableDays') || []).includes(day) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        (form.getValues('availableDays') || []).includes(day)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        const current = form.getValues('availableDays') || []
                        const updated = current.includes(day)
                          ? current.filter(d => d !== day)
                          : [...current, day]
                        form.setValue('availableDays', updated, { shouldValidate: true })
                      }}
                    >
                      {day}
                    </Badge>
                  ))}
                </div>
                {form.formState.errors.availableDays && (
                  <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.availableDays.message || 'Select available days')}</p>
                )}
              </div>

              <FormField
                control={form.control}
                name="deliveryMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Delivery Method</FormLabel>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="online"
                          checked={field.value === 'online'}
                          onChange={() => field.onChange('online')}
                          className="mr-2"
                        />
                        <span className="text-gray-700">Online</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="face-to-face"
                          checked={field.value === 'face-to-face'}
                          onChange={() => field.onChange('face-to-face')}
                          className="mr-2"
                        />
                        <span className="text-gray-700">Face-to-Face</span>
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cv"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-700 font-medium">CV Upload</FormLabel>
                    <FormControl>
                      <Input
                        id="cv"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </FormControl>
                    <p className="text-sm text-gray-400 mt-1">PDF files only, max 5MB</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Tutee Form */}
          {selectedCourse === 'tutees' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Tutee Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Age</FormLabel>
                      <FormControl>
                        <Input
                          id="age"
                          type="number"
                          min="5"
                          max="18"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Gender</FormLabel>
                      <FormControl>
                        <select
                          id="gender"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label className="text-gray-700">Grade Level</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {gradeLevels.map((grade) => (
                    <Badge
                      key={grade}
                      variant={(form.getValues('gradeLevel') || '') === grade ? "default" : "outline"}
                      className={`cursor-pointer ${
                        (form.getValues('gradeLevel') || '') === grade
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => form.setValue('gradeLevel', grade, { shouldValidate: true })}
                    >
                      {grade}
                    </Badge>
                  ))}
                </div>
                {form.formState.errors.gradeLevel && (
                  <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.gradeLevel.message || 'Select a grade level')}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-700">Subjects</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {subjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant={(form.getValues('subjects') || []).includes(subject) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        (form.getValues('subjects') || []).includes(subject)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        const current = form.getValues('subjects') || []
                        const updated = current.includes(subject)
                          ? current.filter(s => s !== subject)
                          : [...current, subject]
                        form.setValue('subjects', updated, { shouldValidate: true })
                      }}
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
                {form.formState.errors.subjects && (
                  <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.subjects.message || 'Select at least one subject')}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Start Time</FormLabel>
                      <FormControl>
                        <Input id="startTime" type="time" className="bg-white border-gray-300 text-gray-900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">End Time</FormLabel>
                      <FormControl>
                        <Input id="endTime" type="time" className="bg-white border-gray-300 text-gray-900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label className="text-gray-700">Available Days</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <Badge
                      key={day}
                      variant={(form.getValues('availableDays') || []).includes(day) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        (form.getValues('availableDays') || []).includes(day)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        const current = form.getValues('availableDays') || []
                        const updated = current.includes(day)
                          ? current.filter(d => d !== day)
                          : [...current, day]
                        form.setValue('availableDays', updated, { shouldValidate: true })
                      }}
                    >
                      {day}
                    </Badge>
                  ))}
                </div>
                {form.formState.errors.availableDays && (
                  <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.availableDays.message || 'Select available days')}</p>
                )}
              </div>

              <FormField
                control={form.control}
                name="deliveryMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Delivery Method</FormLabel>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="online"
                          checked={field.value === 'online'}
                          onChange={() => field.onChange('online')}
                          className="mr-2"
                        />
                        <span className="text-gray-700">Online</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="face-to-face"
                          checked={field.value === 'face-to-face'}
                          onChange={() => field.onChange('face-to-face')}
                          className="mr-2"
                        />
                        <span className="text-gray-700">Face-to-Face</span>
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Training Form */}
          {selectedCourse === 'training' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Training Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Age</FormLabel>
                      <FormControl>
                        <Input
                          id="age"
                          type="number"
                          min="16"
                          max="65"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Gender</FormLabel>
                      <FormControl>
                        <select
                          id="gender"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label className="text-gray-700">Training Type</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {trainingTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={(form.getValues('trainingType') || '') === type ? "default" : "outline"}
                      className={`cursor-pointer ${
                        (form.getValues('trainingType') || '') === type
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => form.setValue('trainingType', type, { shouldValidate: true })}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
                {form.formState.errors.trainingType && (
                  <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.trainingType.message || 'Select training type')}</p>
                )}
              </div>

              <FormField
                control={form.control}
                name="deliveryMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Delivery Method</FormLabel>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="online"
                          checked={field.value === 'online'}
                          onChange={() => field.onChange('online')}
                          className="mr-2"
                        />
                        <span className="text-gray-700">Online</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="face-to-face"
                          checked={field.value === 'face-to-face'}
                          onChange={() => field.onChange('face-to-face')}
                          className="mr-2"
                        />
                        <span className="text-gray-700">Face-to-Face</span>
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Research Form */}
          {selectedCourse === 'research' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Research Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Age</FormLabel>
                      <FormControl>
                        <Input
                          id="age"
                          type="number"
                          min="18"
                          max="65"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Gender</FormLabel>
                      <FormControl>
                        <select
                          id="gender"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="studyArea"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-700 font-medium">Study Area</FormLabel>
                    <FormControl>
                      <textarea
                        id="studyArea"
                        value={field.value || ''}
                        onChange={field.onChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                        rows={3}
                        placeholder="Describe your research area or topic..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="researchLevel"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-700 font-medium">Research Level</FormLabel>
                    <FormControl>
                      <select
                        id="researchLevel"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                      >
                        <option value="">Select Research Level</option>
                        {researchLevels.map((level) => (
                          <option key={level} value={level.toLowerCase()}>{level}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Delivery Method</FormLabel>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="online"
                          checked={field.value === 'online'}
                          onChange={() => field.onChange('online')}
                          className="mr-2"
                        />
                        <span className="text-gray-700">Online</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="face-to-face"
                          checked={field.value === 'face-to-face'}
                          onChange={() => field.onChange('face-to-face')}
                          className="mr-2"
                        />
                        <span className="text-gray-700">Face-to-Face</span>
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Entrepreneurship Form */}
          {selectedCourse === 'entrepreneurship' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Entrepreneurship Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Age</FormLabel>
                      <FormControl>
                        <Input
                          id="age"
                          type="number"
                          min="18"
                          max="65"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">Gender</FormLabel>
                      <FormControl>
                        <select
                          id="gender"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#245D51] hover:bg-[#245D51]/90 text-white"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </Button>
            <Button
              variant="outline"
              onClick={handleBackToCourses}
              className="bg-[#245D51] border-[#245D51] text-white hover:bg-[#245D51]/90"
            >
              Back to Courses
            </Button>
          </div>
        </CardContent>
      </Card>
        </form>
      </Form>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Registration</h1>
        <p className="text-gray-600">Register users for courses in person</p>
      </div>

      {/* User Search */}
      <Card className="bg-white mb-6">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Existing User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter user email to search..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="bg-white border-gray-300 text-gray-900"
                onKeyPress={(e) => e.key === 'Enter' && searchUser()}
              />
            </div>
            <Button
              onClick={searchUser}
              disabled={isSearching}
              className="bg-[#245D51] hover:bg-[#245D51]/90 text-white"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Search Results:</h4>
              {searchResults.map((user) => (
                <div
                  key={user.user_id}
                  className="p-3 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => selectUser(user)}
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-gray-900 font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-gray-600 text-sm">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedUser && (
            <Alert className="mt-4 bg-green-900/20 border-green-600">
              <AlertDescription className="text-green-400">
                Selected: {selectedUser.first_name} {selectedUser.last_name} ({selectedUser.email})
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Course Type Selection */}
      {!selectedCourse && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseTypes.map((course) => {
            const Icon = course.icon
            return (
              <Card
                key={course.id}
                className="bg-white hover:bg-gray-50 cursor-pointer transition-colors border-gray-200"
                onClick={() => setSelectedCourse(course.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${course.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-gray-600">{course.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Course Form */}
      {renderCourseForm()}

      {/* Generated Password Display */}
      {generatedPassword && (
        <Card className="bg-green-50 border-green-200 mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-2">Registration Complete!</h3>
            <p className="text-gray-700 mb-4">User account created successfully. Please provide this password to the user:</p>
            <div className="bg-white p-4 rounded border border-gray-200">
              <code className="text-green-700 font-mono text-lg">{generatedPassword}</code>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              The user can use this password to log in to their account.
            </p>
            <div className="mt-4">
              <Button
                onClick={handleBackToCourses}
                className="bg-[#245D51] hover:bg-[#245D51]/90 text-white"
              >
                Go Back 
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}



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

interface User {
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
}

interface FormData {
  // User fields
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  password: string
  confirmPassword: string
  
  // Course-specific fields
  age?: number
  gender?: string
  gradeLevels?: string[]
  gradeLevel?: string
  subjects?: string[]
  startTime?: string
  endTime?: string
  availableDays?: string[]
  deliveryMethod?: string
  trainingType?: string
  studyArea?: string
  researchLevel?: string
  cv?: File | null
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
  const [formData, setFormData] = useState<FormData>({
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
    cv: null
  })

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setGeneratedPassword(password)
    setFormData(prev => ({ ...prev, password: password, confirmPassword: password }))
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
    setFormData(prev => ({
      ...prev,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      address: user.address
    }))
    setSearchResults([])
    setSearchEmail('')
    toast.success('User selected successfully')
  }

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBackToCourses = () => {
    setSelectedCourse('')
    setSelectedUser(null)
    setGeneratedPassword('')
    setFormData({
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
      cv: null
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setGeneratedPassword('') // Clear any previous success state
    try {
      let userId = selectedUser?.user_id

      // If no user selected, create new user
      if (!userId) {
        const userResponse = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            password: formData.password,
            confirmPassword: formData.confirmPassword
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
      if (selectedCourse === 'tutors' && formData.cv) {
        const formDataFile = new FormData()
        formDataFile.append('cv', formData.cv)
        
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
        age: formData.age,
        gender: formData.gender,
        deliveryMethod: formData.deliveryMethod
      }

      // Add course-specific fields
      switch (selectedCourse) {
        case 'tutors':
          courseData = {
            ...courseData,
            gradeLevels: formData.gradeLevels,
            subjects: formData.subjects,
            startTime: formData.startTime,
            endTime: formData.endTime,
            availableDays: formData.availableDays,
            cvPath: cvPath
          }
          break
        case 'tutees':
          courseData = {
            ...courseData,
            gradeLevel: formData.gradeLevel,
            subjects: formData.subjects,
            startTime: formData.startTime,
            endTime: formData.endTime,
            availableDays: formData.availableDays
          }
          break
        case 'training':
          courseData = {
            ...courseData,
            trainingType: formData.trainingType
          }
          break
        case 'research':
          courseData = {
            ...courseData,
            studyArea: formData.studyArea,
            researchLevel: formData.researchLevel
          }
          break
        case 'entrepreneurship':
          // No additional fields needed
          break
      }

      console.log('🚀 Sending course data:', courseData)
      
      const courseResponse = await fetch(`/api/${selectedCourse}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      })

      const courseResult = await courseResponse.json()
      console.log('🚀 Course registration response:', courseResult)
      
      if (!courseResult.success) {
        throw new Error(courseResult.error || 'Failed to register for course')
      }

      toast.success('Registration completed successfully!')
      setGeneratedPassword(formData.password)
      
      // Reset form
      setFormData({
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
        cv: null
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
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className="bg-white border-gray-300 text-gray-900"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className="bg-white border-gray-300 text-gray-900"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="bg-white border-gray-300 text-gray-900"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="bg-white border-gray-300 text-gray-900"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address" className="text-gray-700 font-medium">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className="bg-white border-gray-300 text-gray-900"
                  required
                />
              </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="bg-white border-gray-300 text-gray-900 pr-10"
                        required
                      />
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      className="bg-white border-gray-300 text-gray-900"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Course-specific fields */}
          {selectedCourse === 'tutors' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Tutor Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-700 font-medium">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="65"
                    value={formData.age || ''}
                    onChange={(e) => updateFormData('age', parseInt(e.target.value))}
                    className="bg-white border-gray-300 text-gray-900"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-700 font-medium">Gender</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => updateFormData('gender', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Grade Levels</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {gradeLevelRanges.map((grade) => (
                    <Badge
                      key={grade}
                      variant={formData.gradeLevels?.includes(grade) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        formData.gradeLevels?.includes(grade)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        const current = formData.gradeLevels || []
                        const updated = current.includes(grade)
                          ? current.filter(g => g !== grade)
                          : [...current, grade]
                        updateFormData('gradeLevels', updated)
                      }}
                    >
                      {grade}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Subjects</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {subjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant={formData.subjects?.includes(subject) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        formData.subjects?.includes(subject)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        const current = formData.subjects || []
                        const updated = current.includes(subject)
                          ? current.filter(s => s !== subject)
                          : [...current, subject]
                        updateFormData('subjects', updated)
                      }}
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-gray-700 font-medium">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => updateFormData('startTime', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-gray-700 font-medium">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => updateFormData('endTime', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Available Days</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <Badge
                      key={day}
                      variant={formData.availableDays?.includes(day) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        formData.availableDays?.includes(day)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        const current = formData.availableDays || []
                        const updated = current.includes(day)
                          ? current.filter(d => d !== day)
                          : [...current, day]
                        updateFormData('availableDays', updated)
                      }}
                    >
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Delivery Method</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="online"
                      checked={formData.deliveryMethod === 'online'}
                      onChange={(e) => updateFormData('deliveryMethod', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Online</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="face-to-face"
                      checked={formData.deliveryMethod === 'face-to-face'}
                      onChange={(e) => updateFormData('deliveryMethod', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Face-to-Face</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cv" className="text-gray-700 font-medium">CV Upload</Label>
                <Input
                  id="cv"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => updateFormData('cv', e.target.files?.[0] || null)}
                  className="bg-white border-gray-300 text-gray-900"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">PDF files only, max 5MB</p>
              </div>
            </div>
          )}

          {/* Tutee Form */}
          {selectedCourse === 'tutees' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Tutee Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-700 font-medium">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="5"
                    max="18"
                    value={formData.age || ''}
                    onChange={(e) => updateFormData('age', parseInt(e.target.value))}
                    className="bg-white border-gray-300 text-gray-900"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-700 font-medium">Gender</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => updateFormData('gender', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Grade Level</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {gradeLevels.map((grade) => (
                    <Badge
                      key={grade}
                      variant={formData.gradeLevel === grade ? "default" : "outline"}
                      className={`cursor-pointer ${
                        formData.gradeLevel === grade
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => updateFormData('gradeLevel', grade)}
                    >
                      {grade}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Subjects</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {subjects.map((subject) => (
                    <Badge
                      key={subject}
                      variant={formData.subjects?.includes(subject) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        formData.subjects?.includes(subject)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        const current = formData.subjects || []
                        const updated = current.includes(subject)
                          ? current.filter(s => s !== subject)
                          : [...current, subject]
                        updateFormData('subjects', updated)
                      }}
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-gray-700 font-medium">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => updateFormData('startTime', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-gray-700 font-medium">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => updateFormData('endTime', e.target.value)}
                    className="bg-white border-gray-300 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Available Days</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <Badge
                      key={day}
                      variant={formData.availableDays?.includes(day) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        formData.availableDays?.includes(day)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        const current = formData.availableDays || []
                        const updated = current.includes(day)
                          ? current.filter(d => d !== day)
                          : [...current, day]
                        updateFormData('availableDays', updated)
                      }}
                    >
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Delivery Method</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="online"
                      checked={formData.deliveryMethod === 'online'}
                      onChange={(e) => updateFormData('deliveryMethod', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Online</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="face-to-face"
                      checked={formData.deliveryMethod === 'face-to-face'}
                      onChange={(e) => updateFormData('deliveryMethod', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Face-to-Face</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Training Form */}
          {selectedCourse === 'training' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Training Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-700 font-medium">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="16"
                    max="65"
                    value={formData.age || ''}
                    onChange={(e) => updateFormData('age', parseInt(e.target.value))}
                    className="bg-white border-gray-300 text-gray-900"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-700 font-medium">Gender</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => updateFormData('gender', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Training Type</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {trainingTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={formData.trainingType === type ? "default" : "outline"}
                      className={`cursor-pointer ${
                        formData.trainingType === type
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => updateFormData('trainingType', type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Delivery Method</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="online"
                      checked={formData.deliveryMethod === 'online'}
                      onChange={(e) => updateFormData('deliveryMethod', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Online</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="face-to-face"
                      checked={formData.deliveryMethod === 'face-to-face'}
                      onChange={(e) => updateFormData('deliveryMethod', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Face-to-Face</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Research Form */}
          {selectedCourse === 'research' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Research Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-700 font-medium">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="65"
                    value={formData.age || ''}
                    onChange={(e) => updateFormData('age', parseInt(e.target.value))}
                    className="bg-white border-gray-300 text-gray-900"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-700 font-medium">Gender</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => updateFormData('gender', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studyArea" className="text-gray-700 font-medium">Study Area</Label>
                <textarea
                  id="studyArea"
                  value={formData.studyArea}
                  onChange={(e) => updateFormData('studyArea', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                  rows={3}
                  placeholder="Describe your research area or topic..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="researchLevel" className="text-gray-700 font-medium">Research Level</Label>
                <select
                  id="researchLevel"
                  value={formData.researchLevel}
                  onChange={(e) => updateFormData('researchLevel', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                  required
                >
                  <option value="">Select Research Level</option>
                  {researchLevels.map((level) => (
                    <option key={level} value={level.toLowerCase()}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-gray-700">Delivery Method</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="online"
                      checked={formData.deliveryMethod === 'online'}
                      onChange={(e) => updateFormData('deliveryMethod', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Online</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="face-to-face"
                      checked={formData.deliveryMethod === 'face-to-face'}
                      onChange={(e) => updateFormData('deliveryMethod', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Face-to-Face</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Entrepreneurship Form */}
          {selectedCourse === 'entrepreneurship' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Entrepreneurship Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-700 font-medium">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="65"
                    value={formData.age || ''}
                    onChange={(e) => updateFormData('age', parseInt(e.target.value))}
                    className="bg-white border-gray-300 text-gray-900"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-700 font-medium">Gender</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => updateFormData('gender', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
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



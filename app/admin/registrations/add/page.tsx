"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BookOpen, GraduationCap, Monitor, Lightbulb, Briefcase, Search, User, Mail, Phone, MapPin, Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import TutorFields from '@/components/admin/registrations/TutorFields'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import TuteeFields from '@/components/admin/registrations/TuteeFields'
import TrainingFields from '@/components/admin/registrations/TrainingFields'
import ResearchFields from '@/components/admin/registrations/ResearchFields'
import EntrepreneurshipFields from '@/components/admin/registrations/EntrepreneurshipFields'

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
  type MinimalInstructor = { instructor_id: string; first_name: string; last_name: string }
  interface InstructorData {
    instructor_id: string;
    first_name: string;
    last_name: string;
  }
  const [instructors, setInstructors] = useState<MinimalInstructor[]>([])
  const [loadingInstructors, setLoadingInstructors] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoadingInstructors(true)
      try {
        const res = await fetch('/api/admin/instructors?limit=1000', { cache: 'no-store' })
        const data = await res.json()
        if (res.ok && data.success) {
          setInstructors((data.data || []).map((i: InstructorData) => ({ instructor_id: i.instructor_id, first_name: i.first_name, last_name: i.last_name })))
        }
      } catch (e) {
      } finally {
        setLoadingInstructors(false)
      }
    }
    load()
  }, [])
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
    courseType: z.enum(['tutors','tutees','training','research','entrepreneurship']).optional(),
    age: z
      .union([z.number().int().min(1, 'Age is required'), z.undefined()])
      .optional(),
    gender: z.enum(['male','female']).optional(),
    gradeLevels: z.array(z.enum(['KG','1-4','5-8','9-12'])).optional(),
    gradeLevel: z.string().optional(),
    subjects: z.array(z.enum(['Maths','Physics','Chemistry','Biology','English','Science','ALL'])).optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/,'Invalid time (HH:MM)').optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/,'Invalid time (HH:MM)').optional(),
    availableDays: z.array(z.enum(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'])).optional(),
    deliveryMethod: z.enum(['online','face-to-face','online-&-face-to-face']).optional(),
    trainingTypes: z.array(z.enum(['Software','Coding','Kaizen','Accounting','Graphics','Video Editing','FX Trading','UX/UI','Digital Marketing'])).optional(),
    studyArea: z.string().optional(),
    researchLevel: z.enum(['undergraduate','graduate','phd','professional']).optional(),
    instructorId: z.string().optional(),
    researchGateId: z
      .string()
      .trim()
      .transform((v) => (v === '' ? undefined : v))
      .refine(
        (v) =>
          v === undefined ||
          /^(https?:\/\/)?(www\.)?researchgate\.net\/.+$/i.test(String(v)) ||
          /^[A-Za-z0-9_.-]{3,}$/i.test(String(v)),
        { message: 'Enter a valid ResearchGate profile URL or username' }
      )
      .optional(),
    orcid: z
      .string()
      .trim()
      .transform((v) => (v === '' ? undefined : v))
      .refine(
        (v) =>
          v === undefined ||
          /^(https?:\/\/)?(www\.)?orcid\.org\/(\d{4}-){3}\d{3}[\dX]$/i.test(String(v)) ||
          /^(\d{4}-){3}\d{3}[\dX]$/i.test(String(v)),
        { message: 'Enter a valid ORCID (e.g., 0000-0002-1825-0097) or profile URL' }
      )
      .optional(),
    cv: z.any()
      .refine(
        (file) => !file || (typeof File !== 'undefined' && file instanceof File && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024),
        'CV must be a PDF file under 5MB'
      )
      .optional(),
  }).superRefine((val, ctx) => {
    // If both times provided, ensure endTime is after startTime
    if (val.startTime && val.endTime) {
      const [sh, sm] = val.startTime.split(':').map(Number)
      const [eh, em] = val.endTime.split(':').map(Number)
      const startMins = sh * 60 + sm
      const endMins = eh * 60 + em
      if (endMins <= startMins) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End time must be after start time',
          path: ['endTime'],
        })
      }
    }
    // Tutors: require presence of core fields on the client
    if (val.courseType === 'tutors') {
      if (!val.age) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Age is required', path: ['age'] })
      }
      if (!val.gender) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Gender is required', path: ['gender'] })
      }
      if (!val.gradeLevels || val.gradeLevels.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select at least one grade range', path: ['gradeLevels'] })
      }
      if (!val.startTime) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Start time is required', path: ['startTime'] })
      }
      if (!val.endTime) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'End time is required', path: ['endTime'] })
      }
      if (!val.availableDays || val.availableDays.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select available days', path: ['availableDays'] })
      }
      if (!val.deliveryMethod) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select delivery method', path: ['deliveryMethod'] })
      }
      if (!val.cv) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CV (PDF) is required', path: ['cv'] })
      }
    }
    // Tutees: require presence of core fields on the client
    if (val.courseType === 'tutees') {
      if (!val.age) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Age is required', path: ['age'] })
      }
      if (!val.gender) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Gender is required', path: ['gender'] })
      }
      if (!val.gradeLevels || val.gradeLevels.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select at least one grade level', path: ['gradeLevels'] })
      }
      if (!val.startTime) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Start time is required', path: ['startTime'] })
      }
      if (!val.endTime) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'End time is required', path: ['endTime'] })
      }
      if (!val.availableDays || val.availableDays.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select available days', path: ['availableDays'] })
      }
      if (!val.deliveryMethod) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select delivery method', path: ['deliveryMethod'] })
      }
      if (!val.subjects || val.subjects.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select at least one subject', path: ['subjects'] })
      }
    }
    // Research: require presence of core fields on the client
    if (val.courseType === 'research') {
      if (!val.age) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Age is required', path: ['age'] })
      }
      if (!val.gender) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Gender is required', path: ['gender'] })
      }
      if (!val.studyArea || String(val.studyArea).trim() === '') {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Study area is required', path: ['studyArea'] })
      }
      if (!val.researchLevel) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select research level', path: ['researchLevel'] })
      }
      if (!val.deliveryMethod) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select delivery method', path: ['deliveryMethod'] })
      }
    }
    // Training: require presence of core fields on the client
    if (val.courseType === 'training') {
      if (!val.age) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Age is required', path: ['age'] })
      }
      if (!val.gender) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Gender is required', path: ['gender'] })
      }
      if (!val.trainingTypes || val.trainingTypes.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select at least one training type', path: ['trainingTypes'] })
      }
      if (!val.deliveryMethod) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select delivery method', path: ['deliveryMethod'] })
      }
    }
    // Entrepreneurship: require presence of core fields on the client
    if (val.courseType === 'entrepreneurship') {
      if (!val.age) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Age is required', path: ['age'] })
      }
      if (!val.gender) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Gender is required', path: ['gender'] })
      }
      if (!val.deliveryMethod) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select delivery method', path: ['deliveryMethod'] })
      }
    }
  })

  type AdminRegistrationValues = z.infer<typeof AdminRegistrationSchema>

  const form = useForm<AdminRegistrationValues>({
    resolver: zodResolver(AdminRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: '',
      courseType: undefined,
      age: undefined,
      gender: undefined,
      gradeLevels: [],
      gradeLevel: '',
      subjects: [],
      startTime: '',
      endTime: '',
      availableDays: [],
      deliveryMethod: undefined,
      trainingTypes: [],
      studyArea: '',
      researchLevel: undefined,
      instructorId: '',
      researchGateId: '',
      orcid: '',
      cv: null,
    },
  })

  // Keep schema-aware course type in sync for conditional validation
  useEffect(() => {
    if (selectedCourse) {
      form.setValue('courseType', selectedCourse as 'tutors' | 'tutees' | 'training' | 'research' | 'entrepreneurship', { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    } else {
      form.setValue('courseType', undefined, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    }
  }, [selectedCourse])

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
      gender: undefined,
      gradeLevels: [],
      gradeLevel: '',
      subjects: [],
      startTime: '',
      endTime: '',
      availableDays: [],
      deliveryMethod: undefined,
      trainingTypes: [],
      studyArea: '',
      researchLevel: undefined,
      cv: null,
    })
  }

  const onSubmit = async (data: AdminRegistrationValues) => {
    setLoading(true)
    setGeneratedPassword('') // Clear any previous success state
    try {
      // Early validation for tutors to avoid partial user creation
      if (selectedCourse === 'tutors') {
        let earlyValidationFailed = false
        if (!data.age) { form.setError('age' as any, { type: 'manual', message: 'Age is required' }); earlyValidationFailed = true }
        if (!data.gender) { form.setError('gender' as any, { type: 'manual', message: 'Gender is required' }); earlyValidationFailed = true }
        if (!data.gradeLevels || data.gradeLevels.length === 0) { form.setError('gradeLevels' as any, { type: 'manual', message: 'Select at least one grade range' }); earlyValidationFailed = true }
        if (!data.subjects || data.subjects.length === 0) { form.setError('subjects' as any, { type: 'manual', message: 'Select at least one subject' }); earlyValidationFailed = true }
        if (!data.startTime) { form.setError('startTime' as any, { type: 'manual', message: 'Start time is required' }); earlyValidationFailed = true }
        if (!data.endTime) { form.setError('endTime' as any, { type: 'manual', message: 'End time is required' }); earlyValidationFailed = true }
        if (!data.availableDays || data.availableDays.length === 0) { form.setError('availableDays' as any, { type: 'manual', message: 'Select available days' }); earlyValidationFailed = true }
        if (!data.deliveryMethod) { form.setError('deliveryMethod' as any, { type: 'manual', message: 'Select delivery method' }); earlyValidationFailed = true }
        if (!data.cv) { form.setError('cv' as any, { type: 'manual', message: 'CV (PDF) is required' }); earlyValidationFailed = true }
        if (earlyValidationFailed) {
          toast.error('Please fix validation errors')
          setLoading(false)
          return
        }
      }

      // Handle file upload for tutors BEFORE user creation to prevent partial inserts
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
          toast.error(uploadData.error || 'Failed to upload CV')
          setLoading(false)
          return
        }
        cvPath = uploadData.data.filePath
      }

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
            confirmPassword: data.confirmPassword,
            adminCreate: true
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

      // Prepare course data based on course type
      let courseData: Record<string, unknown> = {
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
          if (!data.gradeLevels || data.gradeLevels.length === 0) { form.setError('gradeLevels' as any, { type: 'manual', message: 'Select at least one grade level' }); hasValidationError = true }
          if (!data.startTime) { form.setError('startTime' as any, { type: 'manual', message: 'Start time is required' }); hasValidationError = true }
          if (!data.endTime) { form.setError('endTime' as any, { type: 'manual', message: 'End time is required' }); hasValidationError = true }
          if (!data.availableDays || data.availableDays.length === 0) { form.setError('availableDays' as any, { type: 'manual', message: 'Select available days' }); hasValidationError = true }
          if (!data.deliveryMethod) { form.setError('deliveryMethod' as any, { type: 'manual', message: 'Select delivery method' }); hasValidationError = true }
          courseData = {
            ...courseData,
            gradeLevels: data.gradeLevels,
            subjects: data.subjects,
            startTime: data.startTime,
            endTime: data.endTime,
            availableDays: data.availableDays
          }
          break
        case 'training':
          if (!data.age) { form.setError('age' as any, { type: 'manual', message: 'Age is required' }); hasValidationError = true }
          if (!data.gender) { form.setError('gender' as any, { type: 'manual', message: 'Gender is required' }); hasValidationError = true }
          if (!data.trainingTypes || data.trainingTypes.length === 0) { form.setError('trainingTypes' as any, { type: 'manual', message: 'Select at least one training type' }); hasValidationError = true }
          if (!data.deliveryMethod) { form.setError('deliveryMethod' as any, { type: 'manual', message: 'Select delivery method' }); hasValidationError = true }
          courseData = {
            ...courseData,
            trainingTypes: data.trainingTypes,
            instructorId: data.instructorId || undefined,
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
            researchLevel: data.researchLevel,
            instructorId: data.instructorId || undefined,
            researchGateId: data.researchGateId,
            orcid: data.orcid,
          }
          break
        case 'entrepreneurship':
          if (!data.age) { form.setError('age' as any, { type: 'manual', message: 'Age is required' }); hasValidationError = true }
          if (!data.gender) { form.setError('gender' as any, { type: 'manual', message: 'Gender is required' }); hasValidationError = true }
          // No additional fields needed
          courseData = { ...courseData, instructorId: data.instructorId || undefined, deliveryMethod: data.deliveryMethod }
          break
      }

      if (hasValidationError) {
        throw new Error('Validation failed')
      }

      
      const courseResponse = await fetch(`/api/${selectedCourse}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      })

      const courseResult = await courseResponse.json()
      
      if (!courseResponse.ok || !courseResult.success) {
        if (courseResult?.details && Array.isArray(courseResult.details)) {
          courseResult.details.forEach((err: any) => {
            if (err?.message) toast.error(err.message)
          })
        } else {
          toast.error(courseResult.error || 'Failed to register for course')
        }
        return
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
        gender: undefined,
        gradeLevels: [],
        gradeLevel: '',
        subjects: [],
        startTime: '',
        endTime: '',
        availableDays: [],
        deliveryMethod: undefined,
        trainingTypes: [],
        studyArea: '',
        researchLevel: undefined,
        cv: null,
      })
      setSelectedUser(null)
      setSelectedCourse('')

    } catch (error: unknown) {
      console.error('Registration error:', error)
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const renderCourseForm = () => {
    if (!selectedCourse) return null

    return (
      <div className='max-w-5xl'>
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
              <TutorFields
                form={form}
                gradeLevelRanges={gradeLevelRanges}
                subjects={subjects}
                daysOfWeek={daysOfWeek}
              />
            )}

            {/* Tutee Form */}
            {selectedCourse === 'tutees' && (
              <TuteeFields
                form={form}
                gradeLevels={gradeLevels}
                subjects={subjects}
                daysOfWeek={daysOfWeek}
              />
            )}

            {/* Training Form */}
            {selectedCourse === 'training' && (
              <TrainingFields form={form} trainingOptions={trainingTypes} instructors={instructors} />
            )}

            {/* Research Form */}
            {selectedCourse === 'research' && (
              <ResearchFields form={form} instructors={instructors} researchLevels={researchLevels} />
            )}

            {/* Entrepreneurship Form */}
            {selectedCourse === 'entrepreneurship' && (
              <EntrepreneurshipFields form={form} instructors={instructors} />
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
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
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

          {selectedUser && (
            <div className="mt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedUser(null)
                  form.setValue('firstName', '')
                  form.setValue('lastName', '')
                  form.setValue('email', '')
                  form.setValue('phone', '')
                  form.setValue('address', '')
                }}
              >
                Clear selection
              </Button>
            </div>
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

      
    </div>
  )
}



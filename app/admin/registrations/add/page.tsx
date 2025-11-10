"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, GraduationCap, Monitor, Lightbulb, Briefcase } from 'lucide-react'
import TrainingRegistrationForm from '@/components/admin/registrations/forms/TrainingRegistrationForm'
import TutorRegistrationForm from '@/components/admin/registrations/forms/TutorRegistrationForm'
import TuteeRegistrationForm from '@/components/admin/registrations/forms/TuteeRegistrationForm'
import ResearchRegistrationForm from '@/components/admin/registrations/forms/ResearchRegistrationForm'
import EntrepreneurshipRegistrationForm from '@/components/admin/registrations/forms/EntrepreneurshipRegistrationForm'

const courseTypes = [
  { id: 'tutors', name: 'Tutor Registration', icon: BookOpen, color: 'bg-blue-500', description: 'Register a new tutor' },
  { id: 'tutees', name: 'Tutee Registration', icon: GraduationCap, color: 'bg-green-500', description: 'Register a new tutee' },
  { id: 'training', name: 'Training Registration', icon: Monitor, color: 'bg-purple-500', description: 'Register for training program' },
  { id: 'research', name: 'Research Consultation', icon: Lightbulb, color: 'bg-yellow-500', description: 'Register for research consultation' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', icon: Briefcase, color: 'bg-orange-500', description: 'Register for entrepreneurship program' },
]

export default function AdminRegistrationAddPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>('')

  const onBack = () => setSelectedCourse('')

  return (
    <div className="min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Registration</h1>
        <p className="text-gray-600">Register users for courses in person</p>
      </div>

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

      {selectedCourse === 'training' && <TrainingRegistrationForm onBack={onBack} />}
      {selectedCourse === 'tutors' && <TutorRegistrationForm onBack={onBack} />}
      {selectedCourse === 'tutees' && <TuteeRegistrationForm onBack={onBack} />}
      {selectedCourse === 'research' && <ResearchRegistrationForm onBack={onBack} />}
      {selectedCourse === 'entrepreneurship' && <EntrepreneurshipRegistrationForm onBack={onBack} />}
    </div>
  )
}



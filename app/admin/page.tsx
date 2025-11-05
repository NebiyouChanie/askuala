import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, Monitor, Lightbulb, Briefcase, Users } from "lucide-react"
import { headers } from 'next/headers'

async function getStats(): Promise<{
  tutors: number
  tutees: number
  trainings: number
  researches: number
  entrepreneurships: number
  instructors: number
}> {
  try {
    const hdrs = headers()
    const host = hdrs.get('x-forwarded-host') || hdrs.get('host')
    const proto = hdrs.get('x-forwarded-proto') || 'http'
    const base = `${proto}://${host}`
    const res = await fetch(`${base}/api/admin/stats`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to load stats')
    const json = await res.json()
    return json?.data || { tutors: 0, tutees: 0, trainings: 0, researches: 0, entrepreneurships: 0, instructors: 0 }
  } catch {
    return { tutors: 0, tutees: 0, trainings: 0, researches: 0, entrepreneurships: 0, instructors: 0 }
  }
}

export default async function AdminPage() {
  const statsData = await getStats()

  const stats = [
    { label: 'Tutors (students)', value: statsData.tutors, icon: BookOpen, color: 'bg-blue-600' },
    { label: 'Tutees (students)', value: statsData.tutees, icon: GraduationCap, color: 'bg-green-600' },
    { label: 'Training (students)', value: statsData.trainings, icon: Monitor, color: 'bg-purple-600' },
    { label: 'Research (students)', value: statsData.researches, icon: Lightbulb, color: 'bg-yellow-500' },
    { label: 'Entrepreneurship (students)', value: statsData.entrepreneurships, icon: Briefcase, color: 'bg-orange-500' },
    { label: 'Instructors', value: statsData.instructors, icon: Users, color: 'bg-teal-600' },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Key statistics across services</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{label}</CardTitle>
              <div className={`w-10 h-10 ${color} rounded-md flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function AdminInstructorEditPage() {
  const params = useParams<{ user_id: string }>()
  const router = useRouter()
  const userId = params.user_id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [yearsExp, setYearsExp] = useState<string>("")
  const [hourlyRate, setHourlyRate] = useState<string>("")
  const [status, setStatus] = useState<string>("active")
  type Course = { title: string; level?: string; format?: string; topics: string[] }
  const [courses, setCourses] = useState<Course[]>([])
  const [bio, setBio] = useState<string>("")
  const [cvPath, setCvPath] = useState<string|undefined>(undefined)
  const [cvUploading, setCvUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement|null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/instructors/${userId}`)
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load')
        const d = data.data
        setFirstName(d.first_name || '')
        setLastName(d.last_name || '')
        setEmail(d.email)
        setYearsExp(d.years_experience != null ? String(d.years_experience) : "")
        setHourlyRate(d.hourly_rate_etb != null ? String(d.hourly_rate_etb) : "")
        setStatus(d.status || 'active')
        setCourses(Array.isArray(d.courses) ? d.courses : (d.courses ? JSON.parse(d.courses) : []))
        setBio(d.bio || '')
        setCvPath(d.cv_path || undefined)
      } catch (e: any) {
        toast.error(e.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First and last name are required')
      return
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Valid email is required')
      return
    }
    if (courses.length === 0) {
      toast.error('Add at least one course')
      return
    }
    const invalidCourse = courses.find(c => !c.title.trim() || (c.topics?.length ?? 0) === 0)
    if (invalidCourse) {
      toast.error('Each course must have a title and at least one topic')
      return
    }
    try {
      setSaving(true)
      const payload: any = {
        firstName,
        lastName,
        email,
        yearsExperience: yearsExp ? Number(yearsExp) : null,
        hourlyRateEtb: hourlyRate ? Number(hourlyRate) : null,
        status,
        courses,
        bio: bio || null,
        cvPath: cvPath || null,
      }
      const res = await fetch(`/api/admin/instructors/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save')
      toast.success('Instructor updated')
      router.push('/admin/instructors')
    } catch (e: any) {
      toast.error(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-2">Loading...</div>

  const addCourse = () => setCourses((prev) => [...prev, { title: "", topics: [] }])
  const updateCourse = (idx: number, field: keyof Course, value: any) => setCourses((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c))
  const updateCourseTopics = (idx: number, text: string) => updateCourse(idx, 'topics', text.split(',').map(t => t.trim()).filter(Boolean))
  const removeCourse = (idx: number) => setCourses((prev) => prev.filter((_, i) => i !== idx))

  return (
    <div className="p-2">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Edit Instructor</h1>
        <p className="text-sm text-gray-600">
          {firstName} {lastName} · {email}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Years Experience</label>
                <Input type="number" min="0" value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hourly Rate (ETB)</label>
                <Input type="number" min="0" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium mb-1">Courses</label>
                <Button type="button" size="sm" variant="outline" onClick={addCourse}>Add Course</Button>
              </div>
              <div className="space-y-4 mt-2">
                {courses.map((c, i) => (
                  <div key={i} className="border rounded p-3 grid md:grid-cols-12 gap-2 items-end">
                    <div className="md:col-span-3">
                      <label className="block text-xs mb-1">Title</label>
                      <Input value={c.title} onChange={(e) => updateCourse(i, 'title', e.target.value)} required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs mb-1">Level</label>
                      <Input value={c.level || ''} onChange={(e) => updateCourse(i, 'level', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs mb-1">Format</label>
                      <Input value={c.format || ''} onChange={(e) => updateCourse(i, 'format', e.target.value)} placeholder="live/async/f2f" />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs mb-1">Topics (comma separated)</label>
                      <Input onChange={(e) => updateCourseTopics(i, e.target.value)} placeholder="e.g. Algebra, Geometry" />
                    </div>
                    <div className="md:col-span-1 text-right">
                      <Button type="button" size="sm" variant="destructive" onClick={() => removeCourse(i)}>Remove</Button>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && (
                  <div className="text-sm text-gray-500">No courses added yet.</div>
                )}
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CV (PDF only)</label>
              <div className="flex items-center gap-3">
                <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Upload PDF
                </Button>
                {cvPath ? (
                  <a href={cvPath} target="_blank" className="text-sm underline">View uploaded CV</a>
                ) : (
                  <span className="text-sm text-gray-500">No file selected</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept=".pdf,application/pdf"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  if (!file.name.toLowerCase().endsWith('.pdf')) {
                    toast.error('Only PDF files are allowed')
                    return
                  }
                  setCvUploading(true)
                  try {
                    const fd = new FormData()
                    fd.append('cv', file)
                    const res = await fetch('/api/admin/instructors/upload', { method: 'POST', body: fd })
                    const data = await res.json()
                    if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed')
                    setCvPath(data.path)
                    toast.success('CV uploaded')
                  } catch (err: any) {
                    toast.error(err.message || 'Upload failed')
                  } finally {
                    setCvUploading(false)
                  }
                }}
              />
              {cvUploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
              
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saving} className="bg-[#245D51] hover:bg-[#245D51]/90 text-white">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/admin/instructors')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}



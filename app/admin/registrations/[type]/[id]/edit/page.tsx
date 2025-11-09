"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Monitor, Users } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

type Props = { params: { type: string; id: string } }

export default function EditRegistrationPage({ params }: Props) {
  const { type, id } = params
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [instructors, setInstructors] = useState<Array<{ instructor_id: string; first_name: string; last_name: string }>>([])
  const [userId, setUserId] = useState<string>("")
  const [userFirstName, setUserFirstName] = useState<string>("")
  const [userLastName, setUserLastName] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [userPhone, setUserPhone] = useState<string>("")
  const [userAddress, setUserAddress] = useState<string>("")

  // Shared option lists (match registration forms)
  const gradeLevels = ["KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
  const gradeLevelRanges = ["KG", "1-4", "5-8", "9-12"]
  const subjectsList = ["Maths", "Physics", "Chemistry", "Biology", "English", "Science", "ALL"]
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
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

  // Research fields
  const [age, setAge] = useState<number | "">("")
  const [gender, setGender] = useState<"male" | "female" | "">("")
  const [studyArea, setStudyArea] = useState("")
  const [researchLevel, setResearchLevel] = useState<"undergraduate" | "graduate" | "phd" | "professional" | "">("")
  const [deliveryMethod, setDeliveryMethod] = useState<"online" | "face-to-face" | "online-&-face-to-face" | "">("")
  const [researchGateId, setResearchGateId] = useState<string>("")
  const [orcid, setOrcid] = useState<string>("")
  const [reInstructorId, setReInstructorId] = useState<string>("")

  // Tutee fields
  const [tuAge, setTuAge] = useState<number | "">("")
  const [tuGender, setTuGender] = useState<"male" | "female" | "">("")
  const [tuGradeLevels, setTuGradeLevels] = useState<string[]>([])
  const [tuSubjects, setTuSubjects] = useState<string[]>([])
  const [tuStartTime, setTuStartTime] = useState<string>("")
  const [tuEndTime, setTuEndTime] = useState<string>("")
  const [tuAvailableDays, setTuAvailableDays] = useState<string[]>([])
  const [tuDeliveryMethod, setTuDeliveryMethod] = useState<"online" | "face-to-face" | "online-&-face-to-face" | "">("")

  // Training fields
  const [trAge, setTrAge] = useState<number | "">("")
  const [trGender, setTrGender] = useState<"male" | "female" | "">("")
  const [trTrainingTypes, setTrTrainingTypes] = useState<string[]>([])
  const [trDeliveryMethod, setTrDeliveryMethod] = useState<"online" | "face-to-face" | "online-&-face-to-face" | "">("")
  const [trInstructorId, setTrInstructorId] = useState<string>("")

  // Entrepreneurship fields
  const [enAge, setEnAge] = useState<number | "">("")
  const [enGender, setEnGender] = useState<"male" | "female" | "">("")
  const [enDeliveryMethod, setEnDeliveryMethod] = useState<"online" | "face-to-face" | "online-&-face-to-face" | "">("")
  const [enInstructorId, setEnInstructorId] = useState<string>("")

  // Tutor fields
  const [toAge, setToAge] = useState<number | "">("")
  const [toGender, setToGender] = useState<"male" | "female" | "">("")
  const [toGradeLevels, setToGradeLevels] = useState<string[]>([])
  const [toSubjects, setToSubjects] = useState<string[]>([])
  const [toStartTime, setToStartTime] = useState<string>("")
  const [toEndTime, setToEndTime] = useState<string>("")
  const [toAvailableDays, setToAvailableDays] = useState<string[]>([])
  const [toDeliveryMethod, setToDeliveryMethod] = useState<"online" | "face-to-face" | "online-&-face-to-face" | "">("")
  const [toCvPath, setToCvPath] = useState<string>("")
  const [toCvFile, setToCvFile] = useState<File | null>(null)

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const res = await fetch(`/api/${type}/${encodeURIComponent(id)}`, { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok || !data?.data) throw new Error(data?.error || 'Failed to load')
        const r = data.data
        if (ignore) return
        setUserId(r.user_id || "")
        setUserFirstName(r.first_name || "")
        setUserLastName(r.last_name || "")
        setUserEmail(r.email || "")
        setUserPhone(r.phone || "")
        setUserAddress(r.address || "")
        if (type === 'research') {
          setAge(typeof r.age === 'number' ? r.age : (r.age ? Number(r.age) : ""))
          setGender((r.gender as any) || "")
          setStudyArea(r.study_area || "")
          setResearchLevel((r.research_level as any) || "")
          setDeliveryMethod((r.delivery_method as any) || "")
          setResearchGateId(r.researchgate_id || "")
          setOrcid(r.orcid || "")
          setReInstructorId(r.instructor_id || "")
        } else if (type === 'tutees') {
          setTuAge(typeof r.age === 'number' ? r.age : (r.age ? Number(r.age) : ""))
          setTuGender((r.gender as any) || "")
          setTuGradeLevels(Array.isArray(r.grade_levels) ? r.grade_levels : (r.grade_level ? [r.grade_level] : []))
          setTuSubjects(Array.isArray(r.subjects) ? r.subjects : [])
          setTuStartTime(r.start_time || "")
          setTuEndTime(r.end_time || "")
          setTuAvailableDays(Array.isArray(r.available_days) ? r.available_days : [])
          setTuDeliveryMethod((r.delivery_method as any) || "")
        } else if (type === 'training') {
          setTrAge(typeof r.age === 'number' ? r.age : (r.age ? Number(r.age) : ""))
          setTrGender((r.gender as any) || "")
          setTrTrainingTypes(Array.isArray(r.training_types) ? r.training_types : (r.training_type ? [r.training_type] : []))
          setTrDeliveryMethod((r.delivery_method as any) || "")
          setTrInstructorId(r.instructor_id || "")
        } else if (type === 'entrepreneurship') {
          setEnAge(typeof r.age === 'number' ? r.age : (r.age ? Number(r.age) : ""))
          setEnGender((r.gender as any) || "")
          setEnDeliveryMethod((r.delivery_method as any) || "")
          setEnInstructorId(r.instructor_id || "")
        } else if (type === 'tutors') {
          setToAge(typeof r.age === 'number' ? r.age : (r.age ? Number(r.age) : ""))
          setToGender((r.gender as any) || "")
          setToGradeLevels(Array.isArray(r.grade_levels) ? r.grade_levels : [])
          setToSubjects(Array.isArray(r.subjects) ? r.subjects : [])
          setToStartTime(r.start_time || "")
          setToEndTime(r.end_time || "")
          setToAvailableDays(Array.isArray(r.available_days) ? r.available_days : [])
          setToDeliveryMethod((r.delivery_method as any) || "")
          setToCvPath(r.cv_path || "")
        }
      } catch (e: any) {
        toast.error(e?.message || 'Failed to load registration')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    // Load instructors for selects where applicable
    const loadInstructors = async () => {
      if (type === 'research' || type === 'entrepreneurship' || type === 'training') {
        try {
          const res = await fetch(`/api/admin/instructors?limit=1000`)
          const json = await res.json()
          if (res.ok && json?.data) setInstructors(json.data)
        } catch {}
      }
    }
    loadInstructors()
    return () => { ignore = true }
  }, [type, id])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      let payload: any = {}
      // Update user info first if we have a userId
      if (userId) {
        const ures = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: userFirstName,
            last_name: userLastName,
            email: userEmail,
            phone: userPhone,
            address: userAddress,
          }),
        })
        const uj = await ures.json()
        if (!ures.ok || !uj?.success) throw new Error(uj?.error || 'Failed to update user info')
      }
      if (type === 'research') {
        payload = {
          age: typeof age === 'number' ? age : Number(age || 0),
          gender: gender || undefined,
          studyArea: studyArea || undefined,
          researchLevel: researchLevel || undefined,
          deliveryMethod: deliveryMethod || undefined,
          researchGateId: researchGateId?.trim() ?? undefined,
          orcid: orcid?.trim() ?? undefined,
          instructorId: reInstructorId || undefined,
        }
      } else if (type === 'tutees') {
        payload = {
          age: typeof tuAge === 'number' ? tuAge : Number(tuAge || 0),
          gender: tuGender || undefined,
          gradeLevels: tuGradeLevels,
          subjects: tuSubjects,
          startTime: tuStartTime || undefined,
          endTime: tuEndTime || undefined,
          availableDays: tuAvailableDays,
          deliveryMethod: tuDeliveryMethod || undefined,
        }
      } else if (type === 'training') {
        payload = {
          age: typeof trAge === 'number' ? trAge : Number(trAge || 0),
          gender: trGender || undefined,
          trainingTypes: trTrainingTypes,
          deliveryMethod: trDeliveryMethod || undefined,
          instructorId: trInstructorId || undefined,
        }
      } else if (type === 'entrepreneurship') {
        payload = {
          age: typeof enAge === 'number' ? enAge : Number(enAge || 0),
          gender: enGender || undefined,
          deliveryMethod: enDeliveryMethod || undefined,
          instructorId: enInstructorId || undefined,
        }
      } else if (type === 'tutors') {
        let uploadedPath = ""
        if (toCvFile) {
          const fd = new FormData()
          fd.append('cv', toCvFile)
          const up = await fetch('/api/tutors/upload-cv', { method: 'POST', body: fd })
          const uj = await up.json()
          if (!up.ok || !uj?.success) throw new Error(uj?.error || 'Failed to upload CV')
          uploadedPath = uj?.data?.filePath || ""
        }
        payload = {
          age: typeof toAge === 'number' ? toAge : Number(toAge || 0),
          gender: toGender || undefined,
          gradeLevels: toGradeLevels,
          subjects: toSubjects,
          startTime: toStartTime || undefined,
          endTime: toEndTime || undefined,
          availableDays: toAvailableDays,
          deliveryMethod: toDeliveryMethod || undefined,
          cvPath: uploadedPath || toCvPath || undefined,
        }
      }
      const res = await fetch(`/api/${type}/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to save changes')
      toast.success('Registration updated')
      router.push(`/admin/registrations/${type}/${encodeURIComponent(id)}`)
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <Link href={`/admin/registrations?type=${encodeURIComponent(type)}`} className="text-sm text-[#245D51] hover:underline">← Back to Registrations</Link>
      </div>
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">Edit {type === 'tutors' ? 'Tutor' : type === 'tutees' ? 'Tutee' : type.charAt(0).toUpperCase() + type.slice(1)} Registration</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-sm text-gray-600">Loading...</div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-800">User Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">First Name</Label>
                    <Input value={userFirstName} onChange={(e) => setUserFirstName(e.target.value)} className="border-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                    <Input value={userLastName} onChange={(e) => setUserLastName(e.target.value)} className="border-gray-300" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <Input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="border-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Phone</Label>
                    <Input value={userPhone} onChange={(e) => setUserPhone(e.target.value)} className="border-gray-300" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Address</Label>
                  <Input value={userAddress} onChange={(e) => setUserAddress(e.target.value)} className="border-gray-300" />
                </div>
              </div>
              {(type === 'research' || type === 'tutees' || type === 'training' || type === 'entrepreneurship' || type === 'tutors') && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Age</Label>
                  <Input type="number" value={
                    type === 'research' ? (age === '' ? '' : String(age)) :
                    type === 'tutees' ? (tuAge === '' ? '' : String(tuAge)) :
                    type === 'training' ? (trAge === '' ? '' : String(trAge)) :
                    type === 'entrepreneurship' ? (enAge === '' ? '' : String(enAge)) :
                    (toAge === '' ? '' : String(toAge))
                  } onChange={(e) => {
                    const v = e.target.value === '' ? '' : Number(e.target.value)
                    if (type === 'research') setAge(v as any)
                    else if (type === 'tutees') setTuAge(v as any)
                    else if (type === 'training') setTrAge(v as any)
                    else if (type === 'entrepreneurship') setEnAge(v as any)
                    else setToAge(v as any)
                  }} className="border-gray-300" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Gender</Label>
                  <select
                    value={(type === 'research' ? gender : type === 'tutees' ? tuGender : type === 'training' ? trGender : type === 'entrepreneurship' ? enGender : toGender) || ''}
                    onChange={(e) => {
                      const v = e.target.value as any
                      if (type === 'research') setGender(v)
                      else if (type === 'tutees') setTuGender(v)
                      else if (type === 'training') setTrGender(v)
                      else if (type === 'entrepreneurship') setEnGender(v)
                      else setToGender(v)
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              )}

              {type === 'research' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Study Area</Label>
                <textarea
                  value={studyArea}
                  onChange={(e) => setStudyArea(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                  rows={3}
                  placeholder="Describe your research area or topic..."
                />
              </div>
              )}

              {type === 'research' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Research Level</Label>
                    <select
                      value={researchLevel || ''}
                      onChange={(e) => setResearchLevel(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                    >
                      <option value="">Select Research Level</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate</option>
                      <option value="phd">PhD</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Delivery Method</Label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center">
                        <input type="radio" name="researchDeliveryMethod" value="online" checked={deliveryMethod === 'online'} onChange={() => setDeliveryMethod('online')} className="mr-2" />
                        <span className="text-gray-700">Online</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="researchDeliveryMethod" value="face-to-face" checked={deliveryMethod === 'face-to-face'} onChange={() => setDeliveryMethod('face-to-face')} className="mr-2" />
                        <span className="text-gray-700">Face-to-Face</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="researchDeliveryMethod" value="online-&-face-to-face" checked={deliveryMethod === 'online-&-face-to-face'} onChange={() => setDeliveryMethod('online-&-face-to-face')} className="mr-2" />
                        <span className="text-gray-700">Online & Face-to-Face</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Assign Instructor (optional)</Label>
                    <select
                      value={reInstructorId || ''}
                      onChange={(e) => setReInstructorId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                    >
                      <option value="">No Instructor Assigned</option>
                      {instructors.map((ins) => (
                        <option key={ins.instructor_id} value={ins.instructor_id}>{ins.first_name} {ins.last_name}</option>
                      ))}
                    </select>
                  </div>
                  <div />
                </div>
              </div>
              )}

              {type === 'research' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">ResearchGate (optional)</Label>
                  <Input value={researchGateId} onChange={(e) => setResearchGateId(e.target.value)} className="border-gray-300" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">ORCID (optional)</Label>
                  <Input value={orcid} onChange={(e) => setOrcid(e.target.value)} className="border-gray-300" />
                </div>
              </div>
              )}

              {type === 'tutees' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Grade Levels</Label>
                      <div className="flex flex-wrap gap-2">
                        {gradeLevels.map((g) => {
                          const on = tuGradeLevels.includes(g)
                          return (
                            <Badge key={g} variant={on ? "default" : "outline"} className={`${on ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'} cursor-pointer`} onClick={() => setTuGradeLevels(on ? tuGradeLevels.filter(x => x !== g) : [...tuGradeLevels, g])}>
                              {g}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Delivery Method</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center"><input type="radio" name="tuteeDeliveryMethod" value="online" checked={tuDeliveryMethod === 'online'} onChange={() => setTuDeliveryMethod('online')} className="mr-2" /><span className="text-gray-700">Online</span></label>
                        <label className="flex items-center"><input type="radio" name="tuteeDeliveryMethod" value="face-to-face" checked={tuDeliveryMethod === 'face-to-face'} onChange={() => setTuDeliveryMethod('face-to-face')} className="mr-2" /><span className="text-gray-700">Face-to-Face</span></label>
                        <label className="flex items-center"><input type="radio" name="tuteeDeliveryMethod" value="online-&-face-to-face" checked={tuDeliveryMethod === 'online-&-face-to-face'} onChange={() => setTuDeliveryMethod('online-&-face-to-face')} className="mr-2" /><span className="text-gray-700">Online & Face-to-Face</span></label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Subjects</Label>
                    <div className="flex flex-wrap gap-2">
                      {subjectsList.map((s) => (
                        <Badge key={s} variant={tuSubjects.includes(s) ? "default" : "outline"} className={`${tuSubjects.includes(s) ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'} cursor-pointer`} onClick={() => setTuSubjects(tuSubjects.includes(s) ? tuSubjects.filter(x => x !== s) : [...tuSubjects, s])}>
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">Start Time</Label><Input type="time" value={tuStartTime} onChange={(e) => setTuStartTime(e.target.value)} className="border-gray-300" /></div>
                    <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">End Time</Label><Input type="time" value={tuEndTime} onChange={(e) => setTuEndTime(e.target.value)} className="border-gray-300" /></div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Available Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((d) => (
                        <Badge key={d} variant={tuAvailableDays.includes(d) ? "default" : "outline"} className={`${tuAvailableDays.includes(d) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'} cursor-pointer`} onClick={() => setTuAvailableDays(tuAvailableDays.includes(d) ? tuAvailableDays.filter(x => x !== d) : [...tuAvailableDays, d])}>
                          {d}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {type === 'training' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Training Types</Label>
                      <div className="flex flex-wrap gap-2">
                        {trainingOptions.map((opt) => {
                          const on = trTrainingTypes.includes(opt)
                          return (
                            <Badge key={opt} variant={on ? "default" : "outline"} className={`${on ? 'bg-[#245D51] text-white' : 'border-[#245D51]/30 text-[#245D51] hover:bg-[#245D51]/5'} cursor-pointer`} onClick={() => setTrTrainingTypes(on ? trTrainingTypes.filter(x => x !== opt) : [...trTrainingTypes, opt])}>
                              {opt}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Delivery Method</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center"><input type="radio" name="trDeliveryMethod" value="online" checked={trDeliveryMethod === 'online'} onChange={() => setTrDeliveryMethod('online')} className="mr-2" /><span className="text-gray-700">Online</span></label>
                        <label className="flex items-center"><input type="radio" name="trDeliveryMethod" value="face-to-face" checked={trDeliveryMethod === 'face-to-face'} onChange={() => setTrDeliveryMethod('face-to-face')} className="mr-2" /><span className="text-gray-700">Face-to-Face</span></label>
                        <label className="flex items-center"><input type="radio" name="trDeliveryMethod" value="online-&-face-to-face" checked={trDeliveryMethod === 'online-&-face-to-face'} onChange={() => setTrDeliveryMethod('online-&-face-to-face')} className="mr-2" /><span className="text-gray-700">Online & Face-to-Face</span></label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Assign Instructor (optional)</Label>
                    <select
                      value={trInstructorId || ''}
                      onChange={(e) => setTrInstructorId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                    >
                      <option value="">No Instructor Assigned</option>
                      {instructors.map((ins) => (
                        <option key={ins.instructor_id} value={ins.instructor_id}>
                          {ins.first_name} {ins.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {type === 'entrepreneurship' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Delivery Method</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center"><input type="radio" name="enDeliveryMethod" value="online" checked={enDeliveryMethod === 'online'} onChange={() => setEnDeliveryMethod('online')} className="mr-2" /><span className="text-gray-700">Online</span></label>
                        <label className="flex items-center"><input type="radio" name="enDeliveryMethod" value="face-to-face" checked={enDeliveryMethod === 'face-to-face'} onChange={() => setEnDeliveryMethod('face-to-face')} className="mr-2" /><span className="text-gray-700">Face-to-Face</span></label>
                        <label className="flex items-center"><input type="radio" name="enDeliveryMethod" value="online-&-face-to-face" checked={enDeliveryMethod === 'online-&-face-to-face'} onChange={() => setEnDeliveryMethod('online-&-face-to-face')} className="mr-2" /><span className="text-gray-700">Online & Face-to-Face</span></label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Assign Instructor (optional)</Label>
                      <select value={enInstructorId || ''} onChange={(e) => setEnInstructorId(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900">
                        <option value="">No Instructor Assigned</option>
                        {instructors.map((ins) => (
                          <option key={ins.instructor_id} value={ins.instructor_id}>{ins.first_name} {ins.last_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {type === 'tutors' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Grade Levels</Label>
                    <div className="flex flex-wrap gap-2">
                      {gradeLevelRanges.map((g) => (
                        <Badge key={g} variant={toGradeLevels.includes(g) ? "default" : "outline"} className={`${toGradeLevels.includes(g) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'} cursor-pointer`} onClick={() => setToGradeLevels(toGradeLevels.includes(g) ? toGradeLevels.filter(x => x !== g) : [...toGradeLevels, g])}>
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Subjects</Label>
                    <div className="flex flex-wrap gap-2">
                      {subjectsList.map((s) => (
                        <Badge key={s} variant={toSubjects.includes(s) ? "default" : "outline"} className={`${toSubjects.includes(s) ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'} cursor-pointer`} onClick={() => setToSubjects(toSubjects.includes(s) ? toSubjects.filter(x => x !== s) : [...toSubjects, s])}>
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">Start Time</Label><Input type="time" value={toStartTime} onChange={(e) => setToStartTime(e.target.value)} className="border-gray-300" /></div>
                    <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">End Time</Label><Input type="time" value={toEndTime} onChange={(e) => setToEndTime(e.target.value)} className="border-gray-300" /></div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Available Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((d) => (
                        <Badge key={d} variant={toAvailableDays.includes(d) ? "default" : "outline"} className={`${toAvailableDays.includes(d) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'} cursor-pointer`} onClick={() => setToAvailableDays(toAvailableDays.includes(d) ? toAvailableDays.filter(x => x !== d) : [...toAvailableDays, d])}>
                          {d}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Delivery Method</Label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center"><input type="radio" name="toDeliveryMethod" value="online" checked={toDeliveryMethod === 'online'} onChange={() => setToDeliveryMethod('online')} className="mr-2" /><span className="text-gray-700">Online</span></label>
                      <label className="flex items-center"><input type="radio" name="toDeliveryMethod" value="face-to-face" checked={toDeliveryMethod === 'face-to-face'} onChange={() => setToDeliveryMethod('face-to-face')} className="mr-2" /><span className="text-gray-700">Face-to-Face</span></label>
                      <label className="flex items-center"><input type="radio" name="toDeliveryMethod" value="online-&-face-to-face" checked={toDeliveryMethod === 'online-&-face-to-face'} onChange={() => setToDeliveryMethod('online-&-face-to-face')} className="mr-2" /><span className="text-gray-700">Online & Face-to-Face</span></label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">CV Upload</Label>
                    <div className="flex items-center gap-3">
                      {toCvPath ? <a className="underline text-sm" href={toCvPath} target="_blank" rel="noreferrer">Current CV</a> : <span className="text-sm text-gray-500">No CV uploaded</span>}
                      <Input type="file" accept=".pdf" onChange={(e) => setToCvFile(e.target.files?.[0] || null)} className="border-gray-300 max-w-xs" />
                    </div>
                    <p className="text-xs text-gray-500">PDF files only, max 5MB</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving} className="bg-[#245D51] hover:bg-[#245D51]/90 text-white">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}



import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { headers } from 'next/headers'

async function fetchRegistration(type: string, id: string) {
  const hdrs = headers()
  const host = hdrs.get('x-forwarded-host') || hdrs.get('host')
  const proto = hdrs.get('x-forwarded-proto') || 'http'
  const base = `${proto}://${host}`
  const res = await fetch(`${base}/api/${type}/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  const json = await res.json()
  return json?.data || null
}

export default async function RegistrationDetailPage({ params }: { params: { type: string; id: string } }) {
  const { type, id } = params
  const allowed = ['tutors', 'tutees', 'training', 'research', 'entrepreneurship']
  if (!allowed.includes(type)) {
    return (
      <div className="p-6">
        <Card className="bg-white">
          <CardContent className="p-6">Invalid registration type.</CardContent>
        </Card>
      </div>
    )
  }

  const data = await fetchRegistration(type, id)
  if (!data) {
    return (
      <div className="p-6">
        <Card className="bg-white">
          <CardContent className="p-6">Registration not found.</CardContent>
        </Card>
      </div>
    )
  }

  const fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'N/A'

  // Resolve instructor name if assigned
  let instructorName: string | null = null
  if (data.instructor_id) {
    try {
      const hdrs = headers()
      const host = hdrs.get('x-forwarded-host') || hdrs.get('host')
      const proto = hdrs.get('x-forwarded-proto') || 'http'
      const base = `${proto}://${host}`
      const res = await fetch(`${base}/api/admin/instructors/${encodeURIComponent(data.instructor_id)}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        const ins = json?.data
        if (ins) instructorName = `${ins.first_name} ${ins.last_name}`
      }
    } catch {}
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link href="/admin/registrations" className="text-sm text-[#245D51] hover:underline">← Back to Registrations</Link>
      </div>
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">{fullName} · {type.charAt(0).toUpperCase() + type.slice(1)} Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Contact</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div>Email: {data.email || 'N/A'}</div>
                <div>Phone: {data.phone || 'N/A'}</div>
                <div>Address: {data.address || 'N/A'}</div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Meta</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div>Created: {data.created_at ? new Date(data.created_at).toLocaleString() : 'N/A'}</div>
                {'payment_status' in data && <div>Payment: {data.payment_status || 'N/A'}</div>}
                {'instructor_id' in data && (
                  <div>Instructor: {instructorName || (data.instructor_id ? `ID ${data.instructor_id}` : 'N/A')}</div>
                )}
              </div>
            </div>
          </div>

          {/* Type-specific */}
          {type === 'tutors' && (
            <div className="text-sm text-gray-700 space-y-3">
              <div>Subjects: {Array.isArray(data.subjects) ? data.subjects.join(', ') : 'N/A'}</div>
              <div>Grade Levels: {Array.isArray(data.grade_levels) ? data.grade_levels.join(', ') : 'N/A'}</div>
              <div>Schedule: {data.start_time} - {data.end_time}</div>
              <div>Days: {Array.isArray(data.available_days) ? data.available_days.join(', ') : 'N/A'}</div>
              <div>Method: {data.delivery_method || 'N/A'}</div>
              {data.cv_path && (
                <div className="flex gap-3 pt-2">
                  <a
                    href={data.cv_path}
                    target="_blank"
                    className="px-3 py-2 rounded border border-gray-300 text-gray-800 hover:bg-gray-50"
                  >
                    View CV
                  </a>
                  <a
                    href={data.cv_path}
                    download
                    className="px-3 py-2 rounded bg-[#245D51] text-white hover:bg-[#245D51]/90"
                  >
                    Download CV
                  </a>
                </div>
              )}
            </div>
          )}
          {type === 'tutees' && (
            <div className="text-sm text-gray-700 space-y-1">
              <div>Grade: {data.grade_level || 'N/A'}</div>
              <div>Subjects: {Array.isArray(data.subjects) ? data.subjects.join(', ') : 'N/A'}</div>
              <div>Schedule: {data.start_time} - {data.end_time}</div>
              <div>Days: {Array.isArray(data.available_days) ? data.available_days.join(', ') : 'N/A'}</div>
              <div>Method: {data.delivery_method || 'N/A'}</div>
            </div>
          )}
          {type === 'training' && (
            <div className="text-sm text-gray-700 space-y-1">
              <div>Training Type: {data.training_type || 'N/A'}</div>
              <div>Method: {data.delivery_method || 'N/A'}</div>
            </div>
          )}
          {type === 'research' && (
            <div className="text-sm text-gray-700 space-y-1">
              <div>Study Area: {data.study_area || 'N/A'}</div>
              <div>Level: {data.research_level || 'N/A'}</div>
              <div>Method: {data.delivery_method || 'N/A'}</div>
            </div>
          )}
          {type === 'entrepreneurship' && (
            <div className="text-sm text-gray-700 space-y-1">
              <div>Age: {data.age ?? 'N/A'}</div>
              <div>Gender: {data.gender || 'N/A'}</div>
              <div>Method: {data.delivery_method || 'N/A'}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}



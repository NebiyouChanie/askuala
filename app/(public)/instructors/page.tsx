"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { toast } from 'sonner'

type PublicInstructor = {
  instructor_id: string
  first_name: string
  last_name: string
  bio: string | null
  average_rating: number | null
  rating_count: number | null
  years_experience: number | null
  hourly_rate_etb: number | null
  courses: string | null
  cv_path: string | null
}

export default function InstructorsPublicPage() {
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<PublicInstructor[]>([])

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/instructors?limit=30`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load')
      setRows(data.data || [])
    } catch (e: any) {
      toast.error(e.message || 'Failed to load instructors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatRating = (val: any) => {
    const n = typeof val === 'number' ? val : parseFloat(val ?? '0')
    return Number.isFinite(n) ? n.toFixed(2) : '0.00'
  }

  const handleRate = async (instructorId: string, rating: number) => {
    try {
      const res = await fetch(`/api/instructors/${instructorId}/rate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating }) })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to rate')
      toast.success('Thanks for your rating!')
      // Optimistic UI: naive recompute
      setRows((prev) => prev.map((r) => {
        if (r.instructor_id !== instructorId) return r
        const count = (r.rating_count ?? 0) + 1
        const avg = (((r.average_rating ?? 0) * (r.rating_count ?? 0)) + rating) / count
        return { ...r, rating_count: count, average_rating: avg }
      }))
    } catch (e: any) {
      toast.error(e.message || 'Rating failed')
    }
  }

  return (
    <div>
      {/* Page Hero */}
      <section
        className="text-white px-4 sm:px-6 min-h-[40svh] md:min-h-[50svh] relative pt-20 md:pt-28"
        style={{
          backgroundImage: "url(/images/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto min-h-[calc(50svh_-_7rem)] flex items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Instructors</h1>
        </div>
      </section>
      <div className="max-w-7xl mx-auto p-6 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rows.map((r) => {
            const name = `${r.first_name} ${r.last_name}`
            const avg = r.average_rating ?? 0
            const count = r.rating_count ?? 0
            return (
              <Card key={r.instructor_id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={"/images/logo.jpg"}
                      alt={name}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                  </div>

                  <div className="p-6">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-500 mb-1">INSTRUCTOR</p>
                      <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1,2,3,4,5].map((n) => (
                            <button key={n} aria-label={`Rate ${n}`} className="p-0.5" onClick={() => handleRate(r.instructor_id, n)}>
                              <Star className={n <= Math.round(avg) ? 'w-5 h-5 text-yellow-400 fill-current' : 'w-5 h-5 text-gray-300'} />
                            </button>
                          ))}
                        </div>
                        <div className="text-sm text-gray-700">{formatRating(avg)} ({count})</div>
                      </div>
                      {r.years_experience != null && <div>{r.years_experience} yrs</div>}
                    </div>
                    {r.bio && <p className="text-sm text-gray-700 line-clamp-4">{r.bio}</p>}
                    {r.hourly_rate_etb != null && (
                      <div className="text-sm text-gray-600 mt-3">Rate: <span className="text-gray-900 font-medium">ETB {r.hourly_rate_etb}</span>/hour</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {rows.length === 0 && !loading && (
            <div className="text-gray-600">No instructors found.</div>
          )}
        </div>
      </div>
    </div>
  )
}



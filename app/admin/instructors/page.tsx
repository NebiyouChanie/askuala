"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

type InstructorRow = {
  instructor_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  courses: any
  average_rating: number | string | null
  rating_count: number | null
  years_experience: number | null
  hourly_rate_etb: number | null
  cv_path?: string | null
  status: "active" | "inactive" | "suspended"
  created_at: string
}

export default function AdminInstructorsListPage() {
  const [rows, setRows] = useState<InstructorRow[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async (q = search) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/instructors?search=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load")
      setRows(data.data || [])
    } catch (e: any) {
      toast.error(e.message || "Failed to load instructors")
    } finally {
      setLoading(false)
    }
  }

  const formatRating = (val: any) => {
    const n = typeof val === 'number' ? val : parseFloat(val ?? '0')
    return Number.isFinite(n) ? n.toFixed(2) : '0.00'
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/admin/instructors/${deleteId}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete")
      toast.success("Instructor deleted")
      setDeleteId(null)
      load()
    } catch (e: any) {
      toast.error(e.message || "Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Instructors</h1>
        <Link href="/admin/instructors/add">
          <Button className="bg-[#245D51] hover:bg-[#245D51]/90 text-white">Add Instructor</Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-base">All Instructors</CardTitle>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); load() } }}
            />
            <Button size="sm" onClick={() => load()} disabled={loading}>Search</Button>
            <Button size="sm" variant="outline"  onClick={() => { setSearch(""); load("") }} disabled={loading || !search}>
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Rating</th>
                  <th className="py-2 pr-4">Courses</th>
                  <th className="py-2 pr-4">Experience</th>
                  <th className="py-2 pr-4">Rate (ETB/hr)</th>
                  <th className="py-2 pr-4">CV</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.instructor_id} className="border-b">
                    <td className="py-2 pr-4">{r.first_name} {r.last_name}</td>
                    <td className="py-2 pr-4">{r.email}</td>
                    <td className="py-2 pr-4">{r.phone || '-'}</td>
                    <td className="py-2 pr-4">{formatRating(r.average_rating)} ({r.rating_count ?? 0})</td>
                    <td className="py-2 pr-4">{Array.isArray(r.courses) ? r.courses.length : (r.courses ? (() => { try { return JSON.parse(r.courses).length } catch { return 0 } })() : 0)}</td>
                    <td className="py-2 pr-4">{r.years_experience ?? '-'} yrs</td>
                    <td className="py-2 pr-4">{r.hourly_rate_etb ?? '-'}</td>
                    <td className="py-2 pr-4">{r.cv_path ? <a className="underline" href={r.cv_path} target="_blank">View</a> : '-'}</td>
                    <td className="py-2 pr-4">{r.status}</td>
                    <td className="py-2 pr-0 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/admin/instructors/${r.instructor_id}/edit`}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteId(r.instructor_id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-gray-500">{loading ? 'Loading...' : 'No instructors found'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Delete instructor?</h3>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



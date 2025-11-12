"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Feedback = {
  feedback_id: string
  name: string
  email: string
  message: string
  created_at: string
}

export default function AdminFeedbackPage() {
  const [rows, setRows] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(20)

  const load = async (p = page) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/feedback?page=${p}&limit=${limit}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load feedback')
      setRows(data.data || [])
      setTotal(data.pagination?.total || 0)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="p-4">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900">Feedback</CardTitle>
          <div className="text-sm text-gray-600">{loading ? 'Loading...' : `${total} total`}</div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.feedback_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{r.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="line-clamp-3 max-w-xl">{r.message}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-sm text-gray-600">No feedback found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setPage(1); load(1) }} disabled={page === 1}>First</Button>
                <Button variant="outline" size="sm" onClick={() => { const p = Math.max(1, page-1); setPage(p); load(p) }} disabled={page === 1}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => { const p = Math.min(totalPages, page+1); setPage(p); load(p) }} disabled={page === totalPages}>Next</Button>
                <Button variant="outline" size="sm" onClick={() => { setPage(totalPages); load(totalPages) }} disabled={page === totalPages}>Last</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}






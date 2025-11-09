"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, GraduationCap, Monitor, Lightbulb, Briefcase, Users, Calendar, Mail, Phone, MapPin, Eye } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface RegistrationData {
  id: string
  type: string
  user: {
    first_name: string
    last_name: string
    email: string
    phone: string
    address: string
  }
  data: any
  created_at: string
  payment_status?: 'paid' | 'unpaid'
  status?: 'pending' | 'accepted' | 'rejected'
}

const registrationTypes = [
  {
    id: 'tutors',
    name: 'Tutors',
    icon: BookOpen,
    color: 'bg-blue-500',
    description: 'Teaching registrations'
  },
  {
    id: 'tutees',
    name: 'Tutees',
    icon: GraduationCap,
    color: 'bg-green-500',
    description: 'Student registrations'
  },
  {
    id: 'training',
    name: 'Training',
    icon: Monitor,
    color: 'bg-purple-500',
    description: 'Training program registrations'
  },
  {
    id: 'research',
    name: 'Research',
    icon: Lightbulb,
    color: 'bg-yellow-500',
    description: 'Research consultation registrations'
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    icon: Briefcase,
    color: 'bg-orange-500',
    description: 'Entrepreneurship program registrations'
  }
]

export default function AdminRegistrationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = useState<string>('')
  const [registrations, setRegistrations] = useState<RegistrationData[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const markAsPaid = async (type: string, id: string) => {
    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'paid' })
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Failed to update payment status')
        return
      }
      toast.success('Marked as paid')
      fetchRegistrations(type, currentPage)
    } catch (e) {
      console.error('Mark as paid error:', e)
      toast.error('Failed to update payment status')
    }
  }

  const markAsUnpaid = async (type: string, id: string) => {
    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'unpaid' })
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Failed to update payment status')
        return
      }
      toast.success('Marked as unpaid')
      fetchRegistrations(type, currentPage)
    } catch (e) {
      console.error('Mark as unpaid error:', e)
      toast.error('Failed to update payment status')
    }
  }

  const setStatus = async (type: string, id: string, status: 'accepted' | 'rejected') => {
    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Failed to update status')
        return
      }
      toast.success(`Marked as ${status}`)
      fetchRegistrations(type, currentPage)
    } catch (e) {
      console.error('Set status error:', e)
      toast.error('Failed to update status')
    }
  }

  const fetchRegistrations = async (type: string, page: number = 1) => {
    if (!type) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/${type}?page=${page}&limit=${pageSize}`)
      const data = await response.json()
      
      if (data.success) {
        const mappedRegistrations = data.data.map((item: any) => ({
          id: item.tutor_id || item.tutee_id || item.training_id || item.research_id || item.entrepreneurship_id,
          type: type,
          user: {
            first_name: item.first_name || 'N/A',
            last_name: item.last_name || 'N/A',
            email: item.email || 'N/A',
            phone: item.phone || 'N/A',
            address: item.address || 'N/A'
          },
          data: item,
          created_at: item.created_at,
          payment_status: item.payment_status as ('paid' | 'unpaid' | undefined),
          status: item.status as ('pending' | 'accepted' | 'rejected' | undefined),
        }))
        
        setRegistrations(mappedRegistrations)
        setTotal(data.pagination?.total || mappedRegistrations.length)
    } else {
        toast.error(`Failed to load ${type} registrations`)
        setRegistrations([])
        setTotal(0)
      }
    } catch (error) {
      console.error(`Error fetching ${type} registrations:`, error)
      toast.error(`Error loading ${type} registrations`)
      setRegistrations([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    setCurrentPage(1)
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('type', type)
    router.replace(`/admin/registrations?${params.toString()}`)
    fetchRegistrations(type, 1)
  }

  useEffect(() => {
    const t = searchParams?.get('type') || ''
    const valid = registrationTypes.some((rt) => rt.id === t)
    if (valid) {
      setSelectedType(t)
      setCurrentPage(1)
      fetchRegistrations(t, 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchRegistrations(selectedType, page)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
    fetchRegistrations(selectedType, 1)
  }

  const totalPages = Math.ceil(total / pageSize)

  const handleEdit = (registration: RegistrationData) => {
    router.push(`/admin/registrations/${registration.type}/${encodeURIComponent(registration.id)}/edit`)
  }

  const requestDelete = (registration: RegistrationData) => {
    const name = `${registration.user.first_name || ''} ${registration.user.last_name || ''}`.trim() || registration.id
    setDeleteTarget({ id: registration.id, type: registration.type, name })
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/${deleteTarget.type}/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete')
      toast.success('Registration deleted')
      setDeleteTarget(null)
      fetchRegistrations(selectedType, currentPage)
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  const downloadCV = async (cvPath: string, firstName: string, lastName: string) => {
    try {
      // Create a download link
      const link = document.createElement('a')
      link.href = cvPath
      link.download = `${firstName}_${lastName}_CV.pdf`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('CV download started')
    } catch (error) {
      console.error('Error downloading CV:', error)
      toast.error('Failed to download CV')
    }
  }

  const getRegistrationDetails = (registration: RegistrationData) => {
    const { data } = registration
    
    switch (registration.type) {
      case 'tutors':
        return {
          subjects: Array.isArray(data.subjects) ? data.subjects.join(', ') : 'N/A',
          gradeLevels: Array.isArray(data.grade_levels) ? data.grade_levels.join(', ') : 'N/A',
          schedule: `${data.start_time} - ${data.end_time}`,
          days: Array.isArray(data.available_days) ? data.available_days.join(', ') : 'N/A',
          method: data.delivery_method || 'N/A',
          cv: data.cv_path ? 'Yes' : 'No'
        }
      case 'tutees':
        return {
          grade: data.grade_level || 'N/A',
          subjects: Array.isArray(data.subjects) ? data.subjects.join(', ') : 'N/A',
          schedule: `${data.start_time} - ${data.end_time}`,
          days: Array.isArray(data.available_days) ? data.available_days.join(', ') : 'N/A',
          method: data.delivery_method || 'N/A'
        }
      case 'training':
        return {
          type: Array.isArray(data.training_types) ? (data.training_types.join(', ') || 'N/A') : (data.training_type || 'N/A'),
          method: data.delivery_method || 'N/A'
        }
      case 'research':
        return {
          area: data.study_area || 'N/A',
          level: data.research_level || 'N/A',
          method: data.delivery_method || 'N/A'
        }
      case 'entrepreneurship':
        return {
          age: data.age || 'N/A',
          gender: data.gender || 'N/A'
        }
      default:
        return {}
    }
  }

  return (
    <div className="min-h-screen   p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold  mb-2">Registration Management</h1>
          <p className="text-gray-400">Manage all course registrations and user data</p>
      </div>

        {/* Registration Type Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {registrationTypes.map((type) => {
            const IconComponent = type.icon
            const isSelected = selectedType === type.id
            return (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected 
                    ? 'ring-2 ring-[#245D51] bg-[#245D51]/10' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => handleTypeSelect(type.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
          </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Results Section (Table) */}
        {selectedType && (
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {registrationTypes.find(t => t.id === selectedType)?.name} Registrations
                </CardTitle>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {loading ? 'Loading...' : `${total} total`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No registrations found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {registrations.map((registration) => {
                        const details = getRegistrationDetails(registration)
                        return (
                          <tr key={registration.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {registration.user.first_name} {registration.user.last_name}
                              <div className="text-xs text-gray-500">{registration.type.charAt(0).toUpperCase() + registration.type.slice(1)}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{registration.user.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{registration.user.phone}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{registration.user.address}</td>
                            
                            <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                              {new Date(registration.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                              {registration.payment_status ? (
                                <span className={registration.payment_status === 'paid' ? 'text-green-700 bg-green-100 px-2 py-1 rounded' : 'text-yellow-700 bg-yellow-100 px-2 py-1 rounded'}>
                                  {registration.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                                </span>
                              ) : (
                                <span className="text-gray-500">N/A</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                              {registration.status ? (
                                <span
                                  className={
                                    registration.status === 'accepted'
                                      ? 'text-green-700 bg-green-100 px-2 py-1 rounded'
                                      : registration.status === 'rejected'
                                      ? 'text-red-700 bg-red-100 px-2 py-1 rounded'
                                      : 'text-gray-700 bg-gray-100 px-2 py-1 rounded'
                                  }
                                >
                                  {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                                </span>
                              ) : (
                                <span className="text-gray-500">Pending</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                              <div className="inline-flex gap-2 items-center">
                                <Link href={`/admin/registrations/${registration.type}/${encodeURIComponent(registration.id)}`} className="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 hover:bg-gray-50">
                                  <Eye className="w-4 h-4 text-gray-700" />
                                </Link>
                                <Button size="sm" variant="outline" onClick={() => handleEdit(registration)}>Edit</Button>
                                <Button size="sm" variant="destructive" onClick={() => requestDelete(registration)}>Delete</Button>
                                {registration.payment_status !== 'paid' ? (
                                  <Button size="sm" className="bg-[#245D51] hover:bg-[#245D51]/90 text-white" onClick={() => markAsPaid(registration.type, registration.id)}>Paid</Button>
                                ) : (
                                  <Button size="sm" variant="outline" onClick={() => markAsUnpaid(registration.type, registration.id)}>Unpaid</Button>
                                )}
                                <Button
                                  size="sm"
                                  variant={registration.status === 'accepted' ? 'outline' : 'default'}
                                  className={registration.status === 'accepted' ? '' : 'bg-green-600 hover:bg-green-700 text-white'}
                                  onClick={() => setStatus(registration.type, registration.id, 'accepted')}
                                  disabled={registration.status === 'accepted'}
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant={registration.status === 'rejected' ? 'outline' : 'destructive'}
                                  onClick={() => setStatus(registration.type, registration.id, 'rejected')}
                                  disabled={registration.status === 'rejected'}
                                >
                                  Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pagination Controls */}
        {selectedType && registrations.length > 0 && (
          <Card className="bg-white mt-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} registrations
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Show:</label>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-900 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>

                {/* Pagination Buttons */}
          <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    First
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-[#245D51] text-white"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Last
                  </Button>
          </div>
        </div>
            </CardContent>
          </Card>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Delete registration?</h3>
            <p className="text-sm text-gray-600 mb-4">This will permanently delete the {deleteTarget.type} registration for <span className="font-medium">{deleteTarget.name}</span>.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
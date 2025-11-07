"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

export default function AdminInstructorAddPage() {
  const [cvPath, setCvPath] = useState<string|undefined>(undefined)
  const [cvUploading, setCvUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement|null>(null)
  const [submitting, setSubmitting] = useState(false)

  const CourseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    level: z.string().optional(),
    format: z.string().optional(),
    topicsText: z.string().min(1, "At least one topic"),
  })

  const InstructorAddSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    address: z.string().optional(),
    yearsExp: z
      .union([z.string(), z.number()])
      .optional()
      .transform((v) => (v === "" || v == null ? undefined : Number(v)))
      .refine((v) => v == null || (!Number.isNaN(v) && v >= 0), { message: "Must be >= 0" }),
    hourlyRate: z
      .union([z.string(), z.number()])
      .optional()
      .transform((v) => (v === "" || v == null ? undefined : Number(v)))
      .refine((v) => v == null || (!Number.isNaN(v) && v >= 0), { message: "Must be >= 0" }),
    status: z.enum(["active", "inactive", "suspended"], { required_error: "Status is required" }),
    courses: z.array(CourseSchema).min(1, "Add at least one course"),
    bio: z.string().optional(),
  })

  type InstructorAddValues = z.infer<typeof InstructorAddSchema>

  const form = useForm<InstructorAddValues>({
    resolver: zodResolver(InstructorAddSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      yearsExp: undefined,
      hourlyRate: undefined,
      status: "active",
      courses: [],
      bio: "",
    },
  })

  const { fields: courseFields, append, remove } = useFieldArray({
    control: form.control,
    name: "courses",
  })


  const onSubmit = async (values: InstructorAddValues) => {
    try {
      setSubmitting(true)
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || null,
        address: values.address || null,
        yearsExperience: values.yearsExp ?? null,
        hourlyRateEtb: values.hourlyRate ?? null,
        status: values.status,
        courses: values.courses.map(c => ({
          title: c.title,
          level: c.level || undefined,
          format: c.format || undefined,
          topics: c.topicsText.split(',').map(t => t.trim()).filter(Boolean),
        })),
        bio: values.bio || null,
        cvPath: cvPath || null,
      }
      const res = await fetch('/api/admin/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create instructor')
      toast.success('Instructor added')
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        yearsExp: undefined,
        hourlyRate: undefined,
        status: "active",
        courses: [],
        bio: "",
      })
      setCvPath(undefined)
    } catch (e: any) {
      toast.error(e.message || 'Failed to create')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-2 max-w-6xl">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 my-4">Add Instructor</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Instructor Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium mb-1">First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium mb-1">Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium mb-1">Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium mb-1">Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium mb-1">Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="yearsExp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium mb-1">Years Experience</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium mb-1">Hourly Rate (ETB)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium mb-1">Status</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <FormLabel className="block text-sm font-medium mb-1">Courses</FormLabel>
                  <Button type="button" size="sm" variant="outline" onClick={() => append({ title: "", level: "", format: "", topicsText: "" })}>Add Course</Button>
                </div>
                <div className="space-y-4 mt-2">
                  {courseFields.map((fieldItem, i) => (
                    <div key={fieldItem.id} className="border rounded p-3 grid md:grid-cols-12 gap-2 items-end">
                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`courses.${i}.title` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-xs mb-1">Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`courses.${i}.level` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-xs mb-1">Level</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`courses.${i}.format` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-xs mb-1">Format</FormLabel>
                              <FormControl>
                                <Input placeholder="live/async/f2f" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-4">
                        <FormField
                          control={form.control}
                          name={`courses.${i}.topicsText` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-xs mb-1">Topics (comma separated)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Algebra, Geometry" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-1 text-right">
                        <Button type="button" size="sm" variant="destructive" onClick={() => remove(i)}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  {courseFields.length === 0 && (
                    <div className="text-sm text-gray-500">No courses added yet.</div>
                  )}
                </div>
                {form.formState.errors.courses && (typeof form.formState.errors.courses.message === 'string') && (
                  <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.courses.message)}</p>
                )}
              </div>

              <div>
                <FormLabel className="block text-sm font-medium mb-1">CV (PDF only)</FormLabel>
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

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium mb-1">Bio</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting} className="bg-[#245D51] hover:bg-[#245D51]/90 text-white">
                  {submitting ? 'Saving...' : 'Save Instructor'}
                </Button>
                <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}



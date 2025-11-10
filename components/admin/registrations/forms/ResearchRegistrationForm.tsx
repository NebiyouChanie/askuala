"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import ResearchFields from "@/components/admin/registrations/ResearchFields"
import UserSearchSelect, { AdminUser } from "@/components/admin/registrations/UserSearchSelect"

const ResearchSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email('Invalid email'),
	phone: z.string().min(7, 'Phone is required'),
	address: z.string().min(1, 'Address is required'),
	password: z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), z.string().min(8, 'Password must be at least 8 characters').optional()),
	confirmPassword: z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), z.string().optional()),
	age: z.number().int().min(1, 'Age is required'),
	gender: z.enum(['male','female'], { required_error: 'Gender is required' }),
	studyArea: z.string().min(1, 'Study area is required'),
	researchLevel: z.enum(['undergraduate','graduate','phd','professional'], { required_error: 'Select research level' }),
	deliveryMethod: z.enum(['online','face-to-face','online-&-face-to-face'], { required_error: 'Select delivery method' }),
	instructorId: z.string().optional(),
	researchGateId: z.string().optional(),
	orcid: z.string().optional(),
})

type ResearchValues = z.infer<typeof ResearchSchema>

type Props = { onBack: () => void }

export default function ResearchRegistrationForm({ onBack }: Props) {
	const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
	const [instructors, setInstructors] = useState<{ instructor_id: string; first_name: string; last_name: string }[]>([])
	const [loadingInstructors, setLoadingInstructors] = useState(false)
	const [loading, setLoading] = useState(false)

	const researchLevels = ['Undergraduate', 'Graduate', 'PhD', 'Professional']

	const form = useForm<ResearchValues>({
		resolver: zodResolver(ResearchSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: { firstName: '', lastName: '', email: '', phone: '', address: '', password: '', confirmPassword: '', age: undefined, gender: undefined, studyArea: '', researchLevel: undefined, deliveryMethod: undefined, instructorId: '', researchGateId: '', orcid: '' }
	})

	useEffect(() => {
		const load = async () => {
			setLoadingInstructors(true)
			try {
				const res = await fetch('/api/admin/instructors?limit=1000', { cache: 'no-store' })
				const data = await res.json()
				if (res.ok && data.success) {
					setInstructors((data.data || []).map((i: any) => ({ instructor_id: i.instructor_id, first_name: i.first_name, last_name: i.last_name })))
				}
			} finally {
				setLoadingInstructors(false)
			}
		}
		load()
	}, [])

	const handleSelectUser = (user: AdminUser | null) => {
		setSelectedUser(user)
		if (user) {
			form.setValue('firstName', user.first_name)
			form.setValue('lastName', user.last_name)
			form.setValue('email', user.email)
			form.setValue('phone', user.phone)
			form.setValue('address', user.address)
		} else {
			form.reset({ ...form.getValues(), firstName: '', lastName: '', email: '', phone: '', address: '' })
		}
	}

	const onSubmit = async (data: ResearchValues) => {
		setLoading(true)
		try {
			let earlyValidationFailed = false
			if (!data.age) { form.setError('age' as any, { type: 'manual', message: 'Age is required' }); earlyValidationFailed = true }
			if (!data.gender) { form.setError('gender' as any, { type: 'manual', message: 'Gender is required' }); earlyValidationFailed = true }
			if (!data.studyArea || String(data.studyArea).trim() === '') { form.setError('studyArea' as any, { type: 'manual', message: 'Study area is required' }); earlyValidationFailed = true }
			if (!data.researchLevel) { form.setError('researchLevel' as any, { type: 'manual', message: 'Select research level' }); earlyValidationFailed = true }
			if (!data.deliveryMethod) { form.setError('deliveryMethod' as any, { type: 'manual', message: 'Select delivery method' }); earlyValidationFailed = true }
			if (earlyValidationFailed) { toast.error('Please fix validation errors'); setLoading(false); return }

			let userId = selectedUser?.user_id
			if (!userId) {
				if (!data.password) { form.setError('password' as any, { type: 'manual', message: 'Password is required' }); throw new Error('Validation failed') }
				if (!data.confirmPassword) { form.setError('confirmPassword' as any, { type: 'manual', message: 'Please confirm password' }); throw new Error('Validation failed') }
				if (data.password !== data.confirmPassword) { form.setError('confirmPassword' as any, { type: 'manual', message: 'Passwords do not match' }); throw new Error('Validation failed') }

				const userResponse = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ first_name: data.firstName, last_name: data.lastName, email: data.email, phone: data.phone, address: data.address, password: data.password, confirmPassword: data.confirmPassword, adminCreate: true }) })
				const userData = await userResponse.json()
				if (userResponse.status === 409) { toast.error('User with this email already exists. Please search for the user instead.'); setLoading(false); return }
				if (!userResponse.ok || !userData.success) { toast.error(userData.error || 'Failed to create user'); setLoading(false); return }
				userId = userData.user_id
			}

			const dupRes = await fetch(`/api/research?userId=${userId}`)
			const dupData = await dupRes.json()
			if (dupRes.ok && dupData.success && Array.isArray(dupData.data) && dupData.data.length > 0) { toast.error('User is already registered for research'); setLoading(false); return }

			const payload = { userId, age: data.age, gender: data.gender, studyArea: data.studyArea, researchLevel: data.researchLevel, deliveryMethod: data.deliveryMethod, instructorId: data.instructorId || undefined, researchGateId: data.researchGateId, orcid: data.orcid }
			const resp = await fetch('/api/research', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
			const result = await resp.json()
			if (!resp.ok || !result.success) {
				if (result?.details && Array.isArray(result.details)) { result.details.forEach((err: any) => { if (err?.message) toast.error(err.message) }) } else { toast.error(result.error || 'Failed to register for research') }
				setLoading(false)
				return
			}

			toast.success('Research registration completed successfully!')
			form.reset({ firstName: '', lastName: '', email: '', phone: '', address: '', password: '', confirmPassword: '', age: undefined, gender: undefined, studyArea: '', researchLevel: undefined, deliveryMethod: undefined, instructorId: '', researchGateId: '', orcid: '' })
			setSelectedUser(null)
		} catch {
			toast.error('Registration failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="max-w-5xl">
			<Card className="bg-white">
				<CardHeader>
					<CardTitle className="text-gray-900">Research Registration</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<UserSearchSelect selectedUser={selectedUser} onSelect={handleSelectUser} />
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-gray-900">User Information</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField control={form.control} name="firstName" render={({ field }) => (<FormItem className="space-y-2"><FormLabel className="text-gray-700 font-medium">First Name</FormLabel><FormControl><Input className="bg-white border-gray-300 text-gray-900" {...field} /></FormControl><FormMessage /></FormItem>)} />
									<FormField control={form.control} name="lastName" render={({ field }) => (<FormItem className="space-y-2"><FormLabel className="text-gray-700 font-medium">Last Name</FormLabel><FormControl><Input className="bg-white border-gray-300 text-gray-900" {...field} /></FormControl><FormMessage /></FormItem>)} />
									<FormField control={form.control} name="email" render={({ field }) => (<FormItem className="space-y-2"><FormLabel className="text-gray-700 font-medium">Email</FormLabel><FormControl><Input type="email" className="bg-white border-gray-300 text-gray-900" {...field} /></FormControl><FormMessage /></FormItem>)} />
									<FormField control={form.control} name="phone" render={({ field }) => (<FormItem className="space-y-2"><FormLabel className="text-gray-700 font-medium">Phone</FormLabel><FormControl><Input className="bg-white border-gray-300 text-gray-900" {...field} /></FormControl><FormMessage /></FormItem>)} />
									<FormField control={form.control} name="address" render={({ field }) => (<FormItem className="space-y-2 md:col-span-2"><FormLabel className="text-gray-700 font-medium">Address</FormLabel><FormControl><Input className="bg-white border-gray-300 text-gray-900" {...field} /></FormControl><FormMessage /></FormItem>)} />
								</div>

								{!selectedUser && (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField control={form.control} name="password" render={({ field }) => (<FormItem className="space-y-2"><FormLabel className="text-gray-700 font-medium">Password</FormLabel><FormControl><Input type="password" className="bg-white border-gray-300 text-gray-900" {...field} /></FormControl><FormMessage /></FormItem>)} />
										<FormField control={form.control} name="confirmPassword" render={({ field }) => (<FormItem className="space-y-2"><FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel><FormControl><Input type="password" className="bg-white border-gray-300 text-gray-900" {...field} /></FormControl><FormMessage /></FormItem>)} />
									</div>
								)}

								<ResearchFields form={form} instructors={instructors} researchLevels={researchLevels} />

								<div className="flex gap-4"><Button type="submit" disabled={loading} className="bg-[#245D51] hover:bg-[#245D51]/90 text-white">{loading ? 'Registering...' : 'Complete Registration'}</Button><Button variant="outline" onClick={onBack} className="bg-[#245D51] border-[#245D51] text-white hover:bg-[#245D51]/90">Back to Courses</Button></div>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import TuteeFields from "@/components/admin/registrations/TuteeFields"
import UserSearchSelect, { AdminUser } from "@/components/admin/registrations/UserSearchSelect"

const TuteeSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email('Invalid email'),
	phone: z.string().min(7, 'Phone is required'),
	address: z.string().min(1, 'Address is required'),
	password: z.preprocess(
		(v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
		z.string().min(8, 'Password must be at least 8 characters').optional()
	),
	confirmPassword: z.preprocess(
		(v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
		z.string().optional()
	),
	age: z.number().int(),
	gender: z.enum(['male','female'], { required_error: 'Gender is required' }),
	gradeLevels: z.array(z.string()).min(1, 'Select at least one grade level'),
	subjects: z.array(z.string()).min(1, 'Select at least one subject'),
	startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time (HH:MM)'),
	endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time (HH:MM)'),
	availableDays: z.array(z.string()).min(1, 'Select available days'),
	deliveryMethod: z.enum(['online','face-to-face','online-&-face-to-face'], { required_error: 'Select delivery method' }),
}).superRefine((val, ctx) => {
	if (val.startTime && val.endTime) {
		const [sh, sm] = val.startTime.split(':').map(Number)
		const [eh, em] = val.endTime.split(':').map(Number)
		if (eh * 60 + em <= sh * 60 + sm) {
			ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'End time must be after start time', path: ['endTime'] })
		}
	}
})

type TuteeValues = z.infer<typeof TuteeSchema>

type Props = { onBack: () => void }

export default function TuteeRegistrationForm({ onBack }: Props) {
	const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
	const [loading, setLoading] = useState(false)

	const gradeLevels = ['KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
	const subjects = ['Maths', 'Physics', 'Chemistry', 'Biology', 'English', 'Science', 'ALL']
	const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

	const form = useForm<TuteeValues>({
		resolver: zodResolver(TuteeSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			firstName: '', lastName: '', email: '', phone: '', address: '', password: '', confirmPassword: '',
			age: undefined, gender: undefined, gradeLevels: [], subjects: [], startTime: '', endTime: '', availableDays: [], deliveryMethod: undefined,
		}
	})

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

	const onSubmit = async (data: TuteeValues) => {
		setLoading(true)
		try {
			let earlyValidationFailed = false
			if (!data.age) { form.setError('age' as any, { type: 'manual', message: 'Age is required' }); earlyValidationFailed = true }
			if (!data.gender) { form.setError('gender' as any, { type: 'manual', message: 'Gender is required' }); earlyValidationFailed = true }
			if (!data.gradeLevels || data.gradeLevels.length === 0) { form.setError('gradeLevels' as any, { type: 'manual', message: 'Select at least one grade level' }); earlyValidationFailed = true }
			if (!data.startTime) { form.setError('startTime' as any, { type: 'manual', message: 'Start time is required' }); earlyValidationFailed = true }
			if (!data.endTime) { form.setError('endTime' as any, { type: 'manual', message: 'End time is required' }); earlyValidationFailed = true }
			if (!data.availableDays || data.availableDays.length === 0) { form.setError('availableDays' as any, { type: 'manual', message: 'Select available days' }); earlyValidationFailed = true }
			if (!data.deliveryMethod) { form.setError('deliveryMethod' as any, { type: 'manual', message: 'Select delivery method' }); earlyValidationFailed = true }
			if (!data.subjects || data.subjects.length === 0) { form.setError('subjects' as any, { type: 'manual', message: 'Select at least one subject' }); earlyValidationFailed = true }
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

			const dupRes = await fetch(`/api/tutees?userId=${userId}`)
			const dupData = await dupRes.json()
			if (dupRes.ok && dupData.success && Array.isArray(dupData.data) && dupData.data.length > 0) { toast.error('User is already registered as a tutee'); setLoading(false); return }

			const payload = { userId, age: data.age, gender: data.gender, gradeLevels: data.gradeLevels, subjects: data.subjects, startTime: data.startTime, endTime: data.endTime, availableDays: data.availableDays, deliveryMethod: data.deliveryMethod }
			const resp = await fetch('/api/tutees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
			const result = await resp.json()
			if (!resp.ok || !result.success) {
				if (result?.details && Array.isArray(result.details)) { result.details.forEach((err: any) => { if (err?.message) toast.error(err.message) }) } else { toast.error(result.error || 'Failed to register tutee') }
				setLoading(false)
				return
			}

			toast.success('Tutee registration completed successfully!')
			form.reset({ firstName: '', lastName: '', email: '', phone: '', address: '', password: '', confirmPassword: '', age: undefined, gender: undefined, gradeLevels: [], subjects: [], startTime: '', endTime: '', availableDays: [], deliveryMethod: undefined })
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
					<CardTitle className="text-gray-900">Tutee Registration</CardTitle>
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

								<TuteeFields form={form} gradeLevels={gradeLevels} subjects={subjects} daysOfWeek={daysOfWeek} />

								<div className="flex gap-4"><Button type="submit" disabled={loading} className="bg-[#245D51] hover:bg-[#245D51]/90 text-white">{loading ? 'Registering...' : 'Complete Registration'}</Button><Button variant="outline" onClick={onBack} className="bg-[#245D51] border-[#245D51] text-white hover:bg-[#245D51]/90">Back to Courses</Button></div>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}

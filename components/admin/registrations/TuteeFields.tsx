"use client"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

type Props = {
	form: any
	gradeLevels: string[]
	subjects: string[]
	daysOfWeek: string[]
}

export default function TuteeFields({ form, gradeLevels, subjects, daysOfWeek }: Props) {
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-white">Tutee Details</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="age"
					render={({ field }: any) => (
						<FormItem className="space-y-2">
							<FormLabel className="text-gray-700 font-medium">Age</FormLabel>
							<FormControl>
								<Input
									id="age"
									type="number"
									value={field.value ?? ''}
									onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
									className="bg-white border-gray-300 text-gray-900"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="gender"
					render={({ field }: any) => (
						<FormItem className="space-y-2">
							<FormLabel className="text-gray-700 font-medium">Gender</FormLabel>
							<FormControl>
								<select
									id="gender"
									value={field.value || ''}
									onChange={(e) => field.onChange(e.target.value)}
									className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
								>
									<option value="">Select Gender</option>
									<option value="male">Male</option>
									<option value="female">Female</option>
								</select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div>
				<Label className="text-gray-700">Grade Levels</Label>
				<div className="flex flex-wrap gap-2 mt-2">
					{gradeLevels.map((grade) => {
						const selected: string[] = form.getValues('gradeLevels') || []
						const isOn = selected.includes(grade)
						return (
							<Badge
								key={grade}
								variant={isOn ? "default" : "outline"}
								className={`cursor-pointer ${isOn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
								onClick={() => {
									const current: string[] = form.getValues('gradeLevels') || []
									const updated = isOn ? current.filter((g) => g !== grade) : [...current, grade]
									form.setValue('gradeLevels', updated, { shouldValidate: true })
								}}
							>
								{grade}
							</Badge>
						)
					})}
				</div>
				{form.formState.errors.gradeLevels && (
					<p className="text-sm text-red-500 mt-1">{String(form.formState.errors.gradeLevels.message || 'Select at least one grade level')}</p>
				)}
			</div>

			<div>
				<Label className="text-gray-700">Subjects</Label>
				<div className="flex flex-wrap gap-2 mt-2">
					{subjects.map((subject) => (
						<Badge
							key={subject}
							variant={(form.getValues('subjects') || []).includes(subject) ? "default" : "outline"}
							className={`cursor-pointer ${
								(form.getValues('subjects') || []).includes(subject)
									? 'bg-green-600 text-white'
									: 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
							}`}
							onClick={() => {
								const current = form.getValues('subjects') || []
								const updated = current.includes(subject)
									? current.filter((s: string) => s !== subject)
									: [...current, subject]
								form.setValue('subjects', updated, { shouldValidate: true })
							}}
						>
							{subject}
						</Badge>
					))}
				</div>
				{form.formState.errors.subjects && (
					<p className="text-sm text-red-500 mt-1">{String(form.formState.errors.subjects.message || 'Select at least one subject')}</p>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="startTime"
					render={({ field }: any) => (
						<FormItem className="space-y-2">
							<FormLabel className="text-gray-700 font-medium">Start Time</FormLabel>
							<FormControl>
								<Input id="startTime" type="time" className="bg-white border-gray-300 text-gray-900" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="endTime"
					render={({ field }: any) => (
						<FormItem className="space-y-2">
							<FormLabel className="text-gray-700 font-medium">End Time</FormLabel>
							<FormControl>
								<Input id="endTime" type="time" className="bg-white border-gray-300 text-gray-900" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div>
				<Label className="text-gray-700">Available Days</Label>
				<div className="flex flex-wrap gap-2 mt-2">
					{daysOfWeek.map((day) => (
						<Badge
							key={day}
							variant={(form.getValues('availableDays') || []).includes(day) ? "default" : "outline"}
							className={`cursor-pointer ${
								(form.getValues('availableDays') || []).includes(day)
									? 'bg-purple-600 text-white'
									: 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
							}`}
							onClick={() => {
								const current = form.getValues('availableDays') || []
								const updated = current.includes(day)
									? current.filter((d: string) => d !== day)
									: [...current, day]
								form.setValue('availableDays', updated, { shouldValidate: true })
							}}
						>
							{day}
						</Badge>
					))}
				</div>
				{form.formState.errors.availableDays && (
					<p className="text-sm text-red-500 mt-1">{String(form.formState.errors.availableDays.message || 'Select available days')}</p>
				)}
			</div>

			<FormField
				control={form.control}
				name="deliveryMethod"
				render={({ field }: any) => (
					<FormItem>
						<FormLabel className="text-gray-700">Delivery Method</FormLabel>
						<div className="flex gap-4 mt-2">
							<label className="flex items-center">
								<input
									type="radio"
									name="tuteeDeliveryMethod"
									value="online"
									checked={field.value === 'online'}
									onChange={() => field.onChange('online')}
									className="mr-2"
								/>
								<span className="text-gray-700">Online</span>
							</label>
							<label className="flex items-center">
								<input
									type="radio"
									name="tuteeDeliveryMethod"
									value="face-to-face"
									checked={field.value === 'face-to-face'}
									onChange={() => field.onChange('face-to-face')}
									className="mr-2"
								/>
								<span className="text-gray-700">Face-to-Face</span>
							</label>
							<label className="flex items-center">
								<input
									type="radio"
									name="tuteeDeliveryMethod"
									value="online-&-face-to-face"
									checked={field.value === 'online-&-face-to-face'}
									onChange={() => field.onChange('online-&-face-to-face')}
									className="mr-2"
								/>
								<span className="text-gray-700">Online & Face-to-Face</span>
							</label>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	)
}



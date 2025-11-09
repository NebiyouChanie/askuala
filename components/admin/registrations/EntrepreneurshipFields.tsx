"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

type Instructor = { instructor_id: string; first_name: string; last_name: string }

type Props = {
	form: any
	instructors: Instructor[]
}

export default function EntrepreneurshipFields({ form, instructors }: Props) {
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-white">Entrepreneurship Details</h3>
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
									name="entreDeliveryMethod"
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
									name="entreDeliveryMethod"
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
									name="entreDeliveryMethod"
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

			<FormField
				control={form.control}
				name="instructorId"
				render={({ field }: any) => (
					<FormItem className="space-y-2">
						<FormLabel className="text-gray-700 font-medium">Assign Instructor (optional)</FormLabel>
						<FormControl>
							<select
								id="entreInstructor"
								value={field.value || ''}
								onChange={(e) => field.onChange(e.target.value)}
								className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
							>
								<option value="">No Instructor Assigned</option>
								{instructors.map((ins) => (
									<option key={ins.instructor_id} value={ins.instructor_id}>
										{ins.first_name} {ins.last_name}
									</option>
								))}
							</select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	)
}



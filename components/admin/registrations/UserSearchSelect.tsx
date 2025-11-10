"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User as UserIcon, Search } from "lucide-react"
import { toast } from "sonner"

export type AdminUser = {
	user_id: string
	first_name: string
	last_name: string
	email: string
	phone: string
	address: string
}

type Props = {
	onSelect: (user: AdminUser | null) => void
	selectedUser: AdminUser | null
}

export default function UserSearchSelect({ onSelect, selectedUser }: Props) {
	const [searchEmail, setSearchEmail] = useState("")
	const [searchResults, setSearchResults] = useState<AdminUser[]>([])
	const [isSearching, setIsSearching] = useState(false)

	const searchUser = async () => {
		if (!searchEmail.trim()) {
			toast.error("Please enter an email address")
			return
		}

		setIsSearching(true)
		try {
			const response = await fetch(`/api/users/search?email=${encodeURIComponent(searchEmail)}`)
			const data = await response.json()
			if (data.success) {
				setSearchResults(data.users || [])
				if (!data.users || data.users.length === 0) {
					toast.error("No user found with this email")
				}
			} else {
				toast.error("Error searching for user")
			}
		} catch {
			toast.error("Error searching for user")
		} finally {
			setIsSearching(false)
		}
	}

	return (
		<div>
			<div className="flex gap-4">
				<div className="flex-1">
					<Input
						placeholder="Enter user email to search..."
						value={searchEmail}
						onChange={(e) => setSearchEmail(e.target.value)}
						className="bg-white border-gray-300 text-gray-900"
						onKeyDown={(e) => e.key === "Enter" && searchUser()}
					/>
				</div>
				<Button onClick={searchUser} disabled={isSearching} className="bg-[#245D51] hover:bg-[#245D51]/90 text-white">
					{isSearching ? "Searching..." : (
						<div className="flex items-center gap-2"><Search className="h-4 w-4"/>Search</div>
					)}
				</Button>
			</div>

			{searchResults.length > 0 && (
				<div className="mt-4 space-y-2">
					<h4 className="text-sm font-semibold text-gray-700">Search Results:</h4>
					{searchResults.map((user) => (
						<div
							key={user.user_id}
							className="p-3 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100"
							onClick={() => {
								onSelect(user)
								setSearchResults([])
								setSearchEmail("")
								toast.success("User selected successfully")
							}}
						>
							<div className="flex items-center gap-3">
								<UserIcon className="h-5 w-5 text-blue-400" />
								<div>
									<p className="text-gray-900 font-medium">{user.first_name} {user.last_name}</p>
									<p className="text-gray-600 text-sm">{user.email}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{selectedUser && (
				<Alert className="mt-4 bg-green-900/20 border-green-600">
					<AlertDescription className="text-green-400">
						Selected: {selectedUser.first_name} {selectedUser.last_name} ({selectedUser.email})
					</AlertDescription>
				</Alert>
			)}

			{selectedUser && (
				<div className="mt-2">
					<Button
						variant="outline"
						onClick={() => onSelect(null)}
					>
						Clear selection
					</Button>
				</div>
			)}
		</div>
	)
}

import { redirect } from 'next/navigation'

export default async function RegistrationTypeRedirect({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  redirect(`/admin/registrations?type=${encodeURIComponent(type)}`)
}



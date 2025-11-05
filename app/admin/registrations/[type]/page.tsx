import { redirect } from 'next/navigation'

export default function RegistrationTypeRedirect({ params }: { params: { type: string } }) {
  const type = params.type
  redirect(`/admin/registrations?type=${encodeURIComponent(type)}`)
}



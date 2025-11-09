import EditRegistrationClient from "./EditClient"

type Props = { params: Promise<{ type: string; id: string }> }

export default async function Page({ params }: Props) {
  const { type, id } = await params
  return <EditRegistrationClient type={type} id={id} />
}

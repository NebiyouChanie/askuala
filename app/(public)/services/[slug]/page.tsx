import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { services } from "../data"

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const data = services.find((s) => s.slug === slug)
  if (!data) return {}
  return {
    title: `${data.title} | Askuala Services`,
    description: data.shortDescription,
  }
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params
  const data = services.find((s) => s.slug === slug)
  if (!data) return notFound()

  const ctaHref = data.ctaLink || "/contact"

  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <section
        className="text-white px-6 min-h-[50svh] relative pt-28"
        style={{
          backgroundImage: "url(/images/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto min-h-[calc(50svh_-_7rem)] flex items-center">
          <div>
            <p className="text-sm text-white/90 mb-2">
              <Link href="/services" className="underline underline-offset-4">Services</Link> / {data.title}
            </p>
            <h1 className="text-5xl font-bold">{data.title}</h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Card className="">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-gray-700 leading-relaxed">{data.longDescription}</p>

                <h3 className="text-xl font-semibold mt-10 mb-4">What you get</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {data.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                <div className="mt-10 flex gap-4">
                  <Link href={ctaHref}>
                    <Button className="bg-[#FF6652] hover:bg-[#e55a4a] text-white px-6 py-3">Get Started</Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="px-6 py-3">Talk to us</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Who it's for</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Students, parents, educators, schools, NGOs, and businesses seeking affordable, hybrid, technology‑enabled support.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Delivery</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Online and face‑to‑face, with flexible scheduling and pricing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}



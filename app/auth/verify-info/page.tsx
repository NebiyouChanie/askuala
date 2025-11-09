"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Suspense } from "react"

function VerifyInfoPageContent() {
  const params = useSearchParams()
  const email = params?.get('email') || ''

  const resend = async () => {
    if (!email) { toast.error('Missing email'); return }
    try {
      const res = await fetch('/api/auth/verify/resend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      if (!res.ok) throw new Error('Failed to resend verification email')
      toast.success('Verification email sent (check your inbox)')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to resend')
    }
  }

  return (
    <div className="w-full">
      <section className="text-white px-4 sm:px-6 min-h-[40svh] md:min-h-[50svh] relative pt-20 md:pt-28" style={{ backgroundImage: "url(/images/hero-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto min-h-[calc(40svh_-_7rem)] flex items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Verify Your Email</h1>
        </div>
      </section>
      <div className="flex flex-col gap-6 w-full max-w-lg mx-auto px-6 py-12">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Account Created</CardTitle>
            <CardDescription className="text-gray-600">We sent a verification link to your email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-700">Please check your inbox{email ? <> (<span className="font-medium">{email}</span>)</> : ''} to verify your account.</p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={resend} variant="outline">Resend verification email</Button>
              <Link href="/auth/signin"><Button className="bg-[#245D51] hover:bg-[#245D51]/90 text-white">Go to Sign in</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyInfoPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyInfoPageContent />
    </Suspense>
  )
}








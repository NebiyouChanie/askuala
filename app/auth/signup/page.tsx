'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"


const SignupSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(75),
  last_name: z.string().min(1, 'Last name is required').max(75),
  email: z.string().email('Invalid email').max(100),
  phone: z.string().min(1, 'Phone is required').max(20),
  address: z.string().min(1, 'Address is required').max(100),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type SignupFormValues = z.infer<typeof SignupSchema>

export default function SignupForm() {

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: '',
    }
  });
  const router = useRouter()

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) {
        if (result?.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof SignupFormValues, {
              type: 'server',
              message: Array.isArray(messages) ? messages.join(', ') : String(messages),
            })
          })
        } else if (result?.error) {
          toast.error(result.error)
        } else {
          toast.error('Failed to sign up.')
        }
        return
      }
      toast.success('Signup successful! Please verify your email.')
      router.push(`/auth/verify-info?email=${encodeURIComponent(data.email)}`)
  
    } catch (error) { 
      console.log("~ onSubmit ~ error:", error)
      toast.error(`Something went wrong! Please try again later.${error}`);
    }
  };

  return (
    <div className="w-full">
      <section
        className="text-white px-6 min-h-[50svh] relative pt-28"
        style={{ backgroundImage: "url(/images/hero-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto min-h-[calc(50svh_-_7rem)] flex items-center">
          <h1 className="text-5xl font-bold">Sign Up</h1>
        </div>
      </section>
      <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto px-6 py-12" >
      <Card className="bg-white border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-900">Create an Account</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Address</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Subcity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="w-full bg-[#3E9971] hover:bg-[#245D51]/90 text-white" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-2 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/auth/signin" className="font-medium text-[#3E9971] hover:underline underline-offset-4">Sign in</Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}


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
import { signIn } from '@/lib/actions/auth'
import { SignInFormSchema, SignInFormValues } from '@/lib/definitions'
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from "react-hook-form"
import { toast } from 'sonner'

export default function SignInForm() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

 
  const onSubmit = async (data: SignInFormValues) => {
    try {
      // Call the server action
      const result = await signIn(data);
  
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof SignInFormValues, {
            type: "manual",
            message: messages.join(", "),
          });
        });
   
        return;
      }
      //sign-in is successful
      toast.success('Sign-in successful!');
      const role = (result as any)?.role
      const from = searchParams?.get('from') || ''
      const destination = role === 'admin' ? (from.startsWith('/admin') ? from : '/admin') : (from && !from.startsWith('/admin') ? from : '/')
      if (typeof window !== 'undefined') {
        window.location.href = destination
      } else {
        router.replace(destination)
      }
  
    } catch (error) {    
      console.log("~ onSubmit ~ error:", error)
      //internal server error toast
      toast.error('Something went wrong! Please try again later.');
    }
  };
  
  // Show toast messages from verification redirects
  const verifyStatus = searchParams?.get('verified')
  const verifyError = searchParams?.get('verifyError')
  if (verifyStatus === '1') {
    toast.success('Email verified successfully. You can now sign in.')
  }
  if (verifyError) {
    toast.error(decodeURIComponent(verifyError))
  }


  return (
    <div className="w-full">
      <section
        className="text-white px-6 min-h-[50svh] relative pt-28"
        style={{ backgroundImage: "url(/images/hero-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto min-h-[calc(50svh_-_7rem)] flex items-center">
          <h1 className="text-5xl font-bold">Sign In</h1>
        </div>
      </section>
      <div className="flex flex-col gap-6 w-full max-w-sm mx-auto px-6 py-12">
      <Card className="bg-white border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-900">Sign In</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email and password to log in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-8">
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-[#245D51] hover:bg-[#245D51]/90 text-white" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              
            </form>
          </Form>
           
        </CardContent>
      </Card>
      <div className="mt-2 text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <Link href="/auth/signup" className="font-medium text-[#245D51] hover:underline underline-offset-4">Sign up</Link>
      </div>
      </div>
    </div>
  );
}

import { z } from "zod";


//  Singup validation

export const SignupFormSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],  
  });

export type SignupFormValues = z.infer<typeof SignupFormSchema>;


//  login validation

export const SignInFormSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignInFormValues = z.infer<typeof SignInFormSchema>;



 

 
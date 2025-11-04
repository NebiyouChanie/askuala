'use server'

import { SignInFormSchema } from '@/lib/definitions'
import { createSession } from '@/lib/session';
// import { prisma } from '@/lib/prisma';
import { create as dbCreate, findOne as dbFindOne } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { SignupFormSchema } from '@/lib/definitions'

export async function signIn(data: { email: string; password: string }) {
  try {
    // 1. Validate the form data
    const validationResult = SignInFormSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validationResult.data;

    // 2. Check if user exists
    const user = await dbFindOne<any>('users', { email });

    if (!user) {
      return {
        errors: { email: ['No account found for this email'] },
      };
    }

    // 3. Check if the password is correct
    const userPassword = (user as any)?.password as string | undefined
    if (!userPassword) {
      return {
        errors: { password: ['Password authentication is not enabled for this account'] },
      };
    }
    const isPasswordValid = await bcrypt.compare(password, userPassword);

    if (!isPasswordValid) {
      return {
        errors: { password: ['Incorrect email or password'] },
      };
    }

    // 4. Require verified email
    if ((user as any)?.is_verified === 0 || (user as any)?.is_verified === false) {
      return {
        errors: { email: ['Please verify your email before signing in. Check your inbox.'] },
      }
    }

    // 5. Create session
    const role = (user as any)?.role === 'admin' ? 'admin' : 'user'
    const firstName = user.first_name || user.firstName || 'User'
    const lastName = user.last_name || user.lastName || ''
      
    await createSession(user.user_id, firstName, lastName, user.email, role);

    // 6. Return success with role for client redirect
    return { success: true, message: 'Signed in successfully', role };

  } catch (error) {
    console.error('Error during sign-in:', error); // Log the error
    return {
      errors: { global: ['An unexpected error occurred. Please try again later.'] },
    };
  }
}

export async function signup(data: { email: string; password: string; confirmPassword: string }) {
  try {
    // 1. Validate fields using the schema
    const validationResult = SignupFormSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { email, password, confirmPassword } = validationResult.data;

    // 2. Check if passwords match
    if (password !== confirmPassword) {
      return {
        errors: { confirmPassword: ['Passwords do not match'] },
      };
    }

    // 3. Check if user already exists
    const existingUser = await dbFindOne<any>('users', { email });

    if (existingUser) {
      return {
        errors: { email: ['Email is already in use'] },
      };
    }

    // 4. Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Save new user
    await dbCreate('users', { full_name: email.split('@')[0], email, phone: '', address: '' });

    return { success: true, message: 'User created successfully' };

  } catch (error) {
    console.error('Error during signup:', error); // Log the error
    return {
      errors: { global: ['An unexpected error occurred. Please try again later.'] },
    };
  }
}

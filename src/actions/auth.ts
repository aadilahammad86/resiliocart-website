'use server';

import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type AuthState = {
  error: string;
  success: boolean;
  message?: string;
};

export async function signupUser(prevState: AuthState | null, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsed = signupSchema.safeParse(data);

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0].message,
        success: false,
      };
    }

    const { firstName, lastName, username, password } = parsed.data;

    // Check for duplicate username
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return { error: 'Username already exists. Please choose another.', success: false };
    }

    // Hash password securely never store raw strings
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in PostgreSQL database via Prisma
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        password: hashedPassword,
        role: 'USER', // Default
      },
    });

    return {
      success: true,
      message: 'Account created successfully! Redirecting...',
    };
  } catch (error) {
    console.error('Signup Action Error:', error);
    return { error: 'An unexpected error occurred. Please try again.', success: false };
  }
}

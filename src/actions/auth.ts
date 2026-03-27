'use server';

import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { createSession } from '@/lib/session';

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

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function loginUser(prevState: AuthState | null, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
      return { error: 'Invalid credentials. Please try again.', success: false };
    }

    const { username, password } = parsed.data;

    // Fetch the user securely
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { error: 'Invalid credentials. Please try again.', success: false };
    }

    // Compare hash via bcrypt securely (delay prevents instant timing attacks)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: 'Invalid credentials. Please try again.', success: false };
    }

    // Create edge-compatible HTTP-Only Session
    await createSession(user.id, user.username, user.role);

    return { success: true, message: 'Login successful! Redirecting...' };
  } catch (error) {
    console.error('Login Action Error:', error);
    return { error: 'An unexpected error occurred. Please try again.', success: false };
  }
}

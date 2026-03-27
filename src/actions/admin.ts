'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { verifySession } from '@/lib/session';

const adminCreateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['USER', 'SUPERADMIN'], {
    errorMap: () => ({ message: 'A valid role must be selected.' }),
  }),
});

export async function adminCreateUser(prevState: unknown, formData: FormData) {
  try {
    // 1. Strict Server-Side Role Gate
    const session = await verifySession();
    if (!session || session.role !== 'SUPERADMIN') {
      return { error: 'Unauthorized: Only Super Admins can perform this action.', success: false };
    }

    const data = Object.fromEntries(formData.entries());
    const parsed = adminCreateUserSchema.safeParse(data);

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message, success: false };
    }

    const { firstName, lastName, username, password, role } = parsed.data;

    // 2. Duplicate Check
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return { error: 'Username already exists. Please choose another.', success: false };
    }

    // 3. Hash & Commit
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        password: hashedPassword,
        role,
      },
      select: { username: true, role: true }, // Avoid returning hashed pass
    });

    return {
      success: true,
      message: `Successfully created ${newUser.role} account for ${newUser.username}.`,
    };
  } catch (error) {
    console.error('Admin Create User Error:', error);
    return { error: 'An unexpected error occurred. Please try again.', success: false };
  }
}

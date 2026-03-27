'use server';

import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateProfile(prevState: unknown, formData: FormData) {
  try {
    const session = await verifySession();
    if (!session || !session.userId) {
      return { error: 'Unauthorized. Please check your session.', success: false };
    }

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    if (!firstName?.trim() || !lastName?.trim()) {
      return { error: 'First name and last name are strictly required.', success: false };
    }

    await prisma.user.update({
      where: { id: session.userId as string },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
    });

    // Invalidate the cache for the profile page so standard server components reload with fresh data
    revalidatePath('/dashboard/profile');

    return { success: true, message: 'Profile updated successfully!' };
  } catch (error) {
    console.error('Profile update error:', error);
    return { error: 'An unexpected error occurred while saving your profile.', success: false };
  }
}

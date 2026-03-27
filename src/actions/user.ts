'use server';

import { PrismaClient } from '@prisma/client';
import { verifySession, createSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Existing updateProfile action...
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

    revalidatePath('/dashboard/profile');

    return { success: true, message: 'Profile updated successfully!' };
  } catch (error) {
    console.error('Profile update error:', error);
    return { error: 'An unexpected error occurred while saving your profile.', success: false };
  }
}

export async function updateAccountDetails(prevState: unknown, formData: FormData) {
  try {
    const session = await verifySession();
    if (!session || !session.userId) {
      return { error: 'Unauthorized. Please check your session.', success: false };
    }

    // 1. Extract fields
    const newUsername = formData.get('username') as string;
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    let requiresSessionRefresh = false;

    if (!newUsername?.trim()) {
      return { error: 'Username cannot be completely empty.', success: false };
    }

    // 2. Fetch the user's exact current database record
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
    });

    if (!user) {
      return { error: 'User record not found in the database.', success: false };
    }

    const isSuperAdmin = session.role === 'SUPERADMIN';

    // 3. Verify Current Password (If role is standard USER and they are altering credentials)
    if (!isSuperAdmin) {
      if (!currentPassword) {
        return { error: 'Current password is required to make account changes.', success: false };
      }
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return { error: 'Incorrect current password.', success: false };
      }
    }

    const updateData: { username?: string; password?: string } = {};

    // 4. Duplicate Check & Username Swap
    if (newUsername !== user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: newUsername },
      });
      if (existingUser) {
        return { error: 'Username is already taken. Please choose another.', success: false };
      }
      updateData.username = newUsername;
      requiresSessionRefresh = true; // Essential because JWT encodes the username
    }

    // 5. Hash New Password
    if (newPassword) {
      if (newPassword.length < 6) {
        return { error: 'New password must be at least 6 characters long.', success: false };
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // If nothing changed, exit early
    if (Object.keys(updateData).length === 0) {
      return { error: 'No new changes detected to save.', success: false };
    }

    // 6. DB Update
    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // 7. Session Resync (Crucial so user isn't logged out violently)
    if (requiresSessionRefresh) {
      await createSession(user.id, newUsername, user.role);
    }

    revalidatePath('/dashboard/account');

    return { success: true, message: 'Account details updated successfully!' };
  } catch (error) {
    console.error('Account update error:', error);
    return { error: 'An unexpected error occurred while saving your details.', success: false };
  }
}

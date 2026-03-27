'use client';

import * as React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { updateProfile } from '@/actions/user';
import { type AuthState } from '@/actions/auth';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <GlassButton
      variant="primary"
      className="w-full sm:w-auto mt-4"
      type="submit"
      disabled={pending}
    >
      {pending ? 'Saving Changes...' : 'Save Changes'}
    </GlassButton>
  );
}

const initialState: AuthState = { success: false };

export function ProfileForm({
  user,
}: {
  user: { firstName: string; lastName: string; username: string };
}) {
  const [state, formAction] = useFormState(updateProfile, initialState);

  return (
    <GlassCard variant="light" className="p-8 space-y-6">
      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="p-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm shadow-sm transition-all duration-300">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-4 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg backdrop-blur-sm shadow-sm transition-all duration-300">
            {state?.message || 'Profile updated successfully!'}
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-glass-border pb-2">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>
              <GlassInput
                id="firstName"
                type="text"
                name="firstName"
                defaultValue={user.firstName}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <GlassInput
                id="lastName"
                type="text"
                name="lastName"
                defaultValue={user.lastName}
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-glass-border pb-2">
            Account Details
          </h2>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-foreground/70">
              Username (Non-editable)
            </label>
            <GlassInput
              id="username"
              type="text"
              name="username"
              defaultValue={user.username}
              disabled
              className="opacity-70 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </GlassCard>
  );
}

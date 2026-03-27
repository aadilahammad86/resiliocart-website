'use client';

import * as React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { updateAccountDetails } from '@/actions/user';
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

const initialState = { error: '', success: false, message: '' };

export function AccountDetailsForm({
  user,
  isSuperAdmin,
}: {
  user: { username: string };
  isSuperAdmin: boolean;
}) {
  const [state, formAction] = useFormState(updateAccountDetails, initialState);

  return (
    <GlassCard variant="light" className="p-8 space-y-6 max-w-[600px]">
      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="p-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm shadow-sm transition-all duration-300">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-4 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg backdrop-blur-sm shadow-sm transition-all duration-300">
            {state?.message || 'Account details updated successfully!'}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <GlassInput
              id="username"
              type="text"
              name="username"
              defaultValue={user.username}
              required
            />
            <p className="text-xs text-foreground/50">
              Changing your username will refresh your active session.
            </p>
          </div>

          {!isSuperAdmin && (
            <div className="space-y-2 pt-4">
              <label htmlFor="currentPassword" className="text-sm font-medium text-amber-500/90">
                Current Password <span className="text-red-500">*</span>
              </label>
              <GlassInput
                id="currentPassword"
                type="password"
                name="currentPassword"
                placeholder="Required for any changes"
              />
              <p className="text-xs text-foreground/50">
                You must provide your current password to authorize changes.
              </p>
            </div>
          )}

          <div className="space-y-2 pt-4">
            <label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </label>
            <GlassInput
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="Leave blank to keep current"
            />
            {isSuperAdmin && (
              <p className="text-xs text-indigo-400">
                Super Admins can set a new password without providing the old one.
              </p>
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </GlassCard>
  );
}

'use client';

import * as React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { adminCreateUser } from '@/actions/admin';
import { type AuthState } from '@/actions/auth';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <GlassButton variant="primary" className="w-full mt-2" type="submit" disabled={pending}>
      {pending ? 'Creating User...' : 'Create User'}
    </GlassButton>
  );
}

const initialState: AuthState = { success: false };

export default function AddUserPage() {
  const [state, formAction] = useFormState(adminCreateUser, initialState);

  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <main className="p-8 space-y-8 max-w-[800px] mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Add User</h1>
        <p className="text-foreground/70">
          Create a new user account. This page is only accessible to Super Admins.
        </p>
      </div>

      <GlassCard variant="light" className="p-8 space-y-6">
        <form ref={formRef} action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm shadow-sm transition-all duration-300">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="p-3 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg backdrop-blur-sm shadow-sm transition-all duration-300">
              {state?.message || 'User created successfully!'}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>
              <GlassInput id="firstName" type="text" name="firstName" placeholder="John" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <GlassInput id="lastName" type="text" name="lastName" placeholder="Doe" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <GlassInput
                id="username"
                type="text"
                name="username"
                placeholder="johndoe"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                System Role
              </label>
              <select
                id="role"
                name="role"
                defaultValue="USER"
                required
                className="w-full px-4 py-3 bg-white/5 border border-glass-border/40 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all duration-300 shadow-glass-inner"
              >
                <option value="USER" className="text-black bg-white">
                  Standard User
                </option>
                <option value="SUPERADMIN" className="text-black bg-white">
                  Super Admin
                </option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Initial Password
            </label>
            <GlassInput
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <SubmitButton />
        </form>
      </GlassCard>
    </main>
  );
}

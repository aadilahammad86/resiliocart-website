'use client';

import * as React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import Link from 'next/link';
import { signupUser } from '@/actions/auth';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <GlassButton variant="primary" className="w-full mt-2" type="submit" disabled={pending}>
      {pending ? 'Creating Account...' : 'Create Account'}
    </GlassButton>
  );
}

const initialState = { error: '', success: false, message: '' };

export default function Signup() {
  const [state, formAction] = useFormState(signupUser, initialState);
  const router = useRouter();

  React.useEffect(() => {
    if (state?.success) {
      // Redirect to login after a brief delay so they see the bright green success message
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  return (
    <GlassCard variant="light" className="p-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
        <p className="text-sm text-foreground/70">Join us to manage your products seamlessly.</p>
      </div>

      {/* Replaced static mocked form with fully interactive Next.js native Action Form! */}
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm shadow-sm transition-all duration-300">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-3 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg backdrop-blur-sm shadow-sm transition-all duration-300">
            {state?.message || 'Account created successfully! Redirecting...'}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
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
            <label className="text-sm font-medium">First Name</label>
            <GlassInput type="text" name="firstName" placeholder="John" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <GlassInput type="text" name="lastName" placeholder="Doe" required />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <GlassInput id="username" type="text" name="username" placeholder="johndoe" required />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <GlassInput
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <p className="text-xs text-foreground/50" id="passwordHint">
            Must be at least 8 characters long.
          </p>
          <label className="text-sm font-medium">Username</label>
          <GlassInput type="text" name="username" placeholder="johndoe" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <GlassInput type="password" name="password" placeholder="••••••••" required />
          <p className="text-xs text-foreground/50">Must be at least 8 characters long.</p>
        </div>

        <SubmitButton />
      </form>

      <div className="text-center text-sm text-foreground/70">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-500 hover:text-indigo-400 font-medium">
          Sign in
        </Link>
      </div>
    </GlassCard>
  );
}

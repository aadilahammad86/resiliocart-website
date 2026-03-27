'use client';

import * as React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import Link from 'next/link';
import { loginUser } from '@/actions/auth';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <GlassButton variant="primary" className="w-full mt-2" type="submit" disabled={pending}>
      {pending ? 'Signing In...' : 'Sign In'}
    </GlassButton>
  );
}

const initialState = { error: '', success: false, message: '' };

function LoginForm() {
  const [state, formAction] = useFormState(loginUser, initialState);
  const router = useRouter();

  // Natively reads Next.js URL param bindings pushed down by the Middleware natively
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

  React.useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  return (
    <GlassCard variant="light" className="p-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-sm text-foreground/70">Enter your credentials to access your account.</p>
      </div>

      <form action={formAction} className="space-y-4">
        {/* Render a specific toast / dynamic UI block organically responding to the edge middleware tampered cookie redirect context */}
        {errorParam === 'expired' && !state.success && !state.error && (
          <div className="p-3 text-sm text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-lg backdrop-blur-sm shadow-sm transition-all duration-300">
            Your session has been logically expired or invalidated. Please securely log in again.
          </div>
        )}

        {state?.error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm shadow-sm transition-all duration-300">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-3 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg backdrop-blur-sm shadow-sm transition-all duration-300">
            {state?.message || 'Login successful! Redirecting...'}
          </div>
        )}

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
        </div>

        <SubmitButton />
      </form>

      <div className="text-center text-sm text-foreground/70">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-indigo-500 hover:text-indigo-400 font-medium">
          Sign up
        </Link>
      </div>
    </GlassCard>
  );
}

// Ensure the dynamic SearchParams component is wrapped in an explicit Suspense boundary to cleanly satisfy the modern Next.js 15+ constraints generically.
export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

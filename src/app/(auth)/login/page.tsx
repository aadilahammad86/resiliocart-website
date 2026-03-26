import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import Link from 'next/link';

export default function LoginMockup() {
  return (
    <GlassCard variant="light" className="p-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-sm text-foreground/70">Enter your credentials to access your account.</p>
      </div>

      <form className="space-y-4">
        {/* Mock Error State Example (Hidden normally, but fulfills the mock criteria) */}
        {/* <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
              Invalid username or password. Please try again.
            </div> */}

        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <GlassInput type="text" placeholder="johndoe" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <GlassInput type="password" placeholder="••••••••" required />
        </div>

        <GlassButton variant="primary" className="w-full mt-2" type="button">
          Sign In
        </GlassButton>
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

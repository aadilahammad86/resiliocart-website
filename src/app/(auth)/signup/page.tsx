import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import Link from 'next/link';

export default function SignupMockup() {
  return (
    <GlassCard variant="light" className="p-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
        <p className="text-sm text-foreground/70">Join us to manage your products seamlessly.</p>
      </div>

      <form className="space-y-4">
        {/* Mock Success State Example (Hidden normally, but fulfills the mock criteria) */}
        {/* <div className="p-3 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg backdrop-blur-sm">
              Account created successfully! Redirecting to dashboard...
            </div> */}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Name</label>
            <GlassInput type="text" placeholder="John" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <GlassInput type="text" placeholder="Doe" required />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <GlassInput type="text" placeholder="johndoe" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <GlassInput type="password" placeholder="••••••••" required />
          <p className="text-xs text-foreground/50">Must be at least 8 characters long.</p>
        </div>

        <GlassButton variant="primary" className="w-full mt-2" type="button">
          Create Account
        </GlassButton>
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

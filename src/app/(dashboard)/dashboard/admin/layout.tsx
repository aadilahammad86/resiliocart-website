import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AdminAddUserLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  // Server-side role guard: only SUPERADMIN can access admin pages
  if (!session || (session.role as string)?.toUpperCase() !== 'SUPERADMIN') {
    redirect('/dashboard');
  }

  return <>{children}</>;
}

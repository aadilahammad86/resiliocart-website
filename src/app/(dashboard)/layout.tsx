import { Sidebar } from '@/components/ui/Sidebar';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  // Defensive server-side guard (middleware already handles this, but belt-and-suspenders)
  if (!session) {
    redirect('/login');
  }

  // Extract the role from the cryptographically verified JWT payload
  const userRole = (session.role as string)?.toUpperCase() === 'SUPERADMIN' ? 'SUPERADMIN' : 'USER';

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar role={userRole} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto pt-14 md:pt-0">{children}</main>
    </div>
  );
}

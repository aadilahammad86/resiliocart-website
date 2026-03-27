import { verifySession } from '@/lib/session';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { AccountDetailsForm } from '@/components/features/AccountDetailsForm';

const prisma = new PrismaClient();

export default async function AccountPage() {
  const session = await verifySession();

  if (!session || !session.userId) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { username: true, role: true },
  });

  if (!user) {
    redirect('/login');
  }

  const isSuperAdmin = user.role === 'SUPERADMIN';

  return (
    <main className="p-8 space-y-8 max-w-[1500px] mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Details</h1>
        <p className="text-foreground/70">Manage your login credentials safely.</p>
      </div>

      <AccountDetailsForm user={{ username: user.username }} isSuperAdmin={isSuperAdmin} />
    </main>
  );
}

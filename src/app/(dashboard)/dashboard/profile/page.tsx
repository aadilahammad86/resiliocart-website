import { verifySession } from '@/lib/session';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/features/ProfileForm';

const prisma = new PrismaClient();

export default async function ProfilePage() {
  const session = await verifySession();

  if (!session || !session.userId) {
    redirect('/login');
  }

  // Fetch the fresh user data from the database to pre-populate the form
  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { firstName: true, lastName: true, username: true },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="p-8 space-y-8 max-w-[1000px] mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-foreground/70">Manage your personal information and preferences.</p>
      </div>

      <ProfileForm user={user} />
    </main>
  );
}

import { Sidebar } from '@/components/ui/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* 
        Mocking Super Admin role specifically to fulfill the design reference requirement.
        Change this role prop to "user" to test the restricted view. 
      */}
      <Sidebar role="superadmin" />

      <main className="flex-1 overflow-x-hidden overflow-y-auto">{children}</main>
    </div>
  );
}

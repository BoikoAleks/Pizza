import { Container } from "@/shared/components/shared/container";
import { Title } from "@/shared/components/shared/title";
import { ManagerNav } from "./_components/manager-nav";
import { checkManagerRole } from "@/shared/lib/check-manager-role.";
import { SignOutButton } from "@/shared/components/shared/sign-out-button";
import { ManagerNotificationHandler } from "./manager/chat/_components/manager-notification";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkManagerRole();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <Container className="flex justify-between items-center py-4">
          <Title text="Панель менеджера" size="md" className="font-bold text-[var(--primary)]" />
          <SignOutButton />
        </Container>
      </header>
      <nav className="bg-white border-b">
        <Container>
          <ManagerNav />
        </Container>
      </nav>
      <main className="py-10">
        <Container>{children}</Container>
      </main>
      <ManagerNotificationHandler />
    </div>
  );
}

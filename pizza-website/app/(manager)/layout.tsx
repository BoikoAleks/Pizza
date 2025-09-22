// ФАЙЛ: app/manager/layout.tsx
import { Container } from "@/shared/components/shared/container";
import { SignOutButton } from "@/shared/components/shared/sign-out-button";
import { Title } from "@/shared/components/shared/title";
import { ManagerNav } from "./_components/manager-nav";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <Container className="flex justify-between items-center py-4">
          <Title text="Панель менеджера" size="md" className="font-bold" />
          <SignOutButton />
        </Container>
      </header>

      {/* 2. Додаємо блок з навігацією */}
      <nav className="bg-white border-b">
        <Container>
          <ManagerNav />
        </Container>
      </nav>

      <main className="py-10">
        <Container>{children}</Container>
      </main>
    </div>
  );
}

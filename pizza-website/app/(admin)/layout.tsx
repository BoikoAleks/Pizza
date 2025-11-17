import { ReactNode } from "react";

export const metadata = {
  title: "Адмін панель",
  description: "Керування контентом Republic Pizza",
};

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4 text-lg font-semibold text-gray-900">
        Admin Header
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}

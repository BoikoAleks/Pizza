import { Header } from "@/shared/components/shared";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Pizza Website",
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    // Просто повертаємо контент, який буде вкладено в кореневий layout
    <main className="min-h-screen">
      
      {children}
      {modal}
      
      
    </main>
  );
}

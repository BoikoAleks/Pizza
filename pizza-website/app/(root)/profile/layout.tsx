import { Container } from "@/shared/components/shared/container";
import { Title } from "@/shared/components/shared/title";
import { getUserSession } from "@/shared/lib/get-user-session";
import { redirect } from "next/navigation";
import { ProfileSidebar } from "./profile-sidebar";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();
  if (!session) {
    redirect("/not-auth");
  }

  return (
    <Container className="my-10">
      <Title text="Особистий кабінет" size="lg" className="font-extrabold" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mt-10">
        <aside className="col-span-1 md:col-span-3">
          <ProfileSidebar />
        </aside>
        <main className="col-span-1 md:col-span-9">{children}</main>
      </div>
    </Container>
  );
}

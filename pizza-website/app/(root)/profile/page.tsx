import { prisma } from "@/prisma/prisma-client";
import { ProfileForm } from "@/shared/components/shared/profile-form";
import { getUserSession } from "@/shared/lib/get-user-session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getUserSession();

  if (!session) {
    return redirect("/not-auth");
  }

  const where =
    session?.id
      ? { id: Number(session.id) }
      : session?.email
        ? { email: session.email }
        : undefined;

  if (!where) {
    // Обробіть ситуацію, коли немає id чи email
    throw new Error("User id or email is required");
  }

  const user = await prisma.user.findFirst({ where });

  if (!user) {
    return redirect("/not-auth");
  }

  return <ProfileForm data={user} />;
}
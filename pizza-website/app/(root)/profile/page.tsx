import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { redirect } from "next/navigation";
import { PersonalDataForm } from "./personal-data-form";

export default async function PersonalDataPage() {
  const session = await getUserSession();
  if (!session) redirect("/not-auth");

  const user = await prisma.user.findUnique({
    where: { id: Number(session.id) },
  });

  if (!user) redirect("/not-auth");

  return <PersonalDataForm user={user} />;
}

import { redirect } from "next/navigation";
import { getUserSession } from "./get-user-session";

export async function checkManagerRole() {
    const session = await getUserSession();

    const isManager = session?.role === 'MANAGER' || session?.role === 'ADMIN';

    if (!isManager) {
        redirect('/forbidden');
    }


    return session;
}
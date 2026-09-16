import type { Metadata } from "next";
import { AccountView } from "@/components/app/AccountView";
import { requireCustomer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Hesabım" };

export default async function CustomerAccountPage() {
  const user = await requireCustomer();
  return <AccountView userId={user.id} />;
}

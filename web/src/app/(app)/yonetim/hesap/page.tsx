import type { Metadata } from "next";
import { AccountView } from "@/components/app/AccountView";
import { MyStaffDevicesCard } from "@/components/app/staff-devices";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Hesabım" };

export default async function TeamAccountPage() {
  const user = await requireStaff();
  return <AccountView userId={user.id} extra={<MyStaffDevicesCard userId={user.id} />} />;
}

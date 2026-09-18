import type { DeskAccountUser } from "./session";

// The user object the app expects (flutter/lib/common/hbbs/hbbs.dart, UserPayload.fromJson):
// status 1 is a normal account, and is_admin unlocks nothing here — GoTech staff simply see every
// customer's computers, which the address book already decides.
export const userPayload = (user: DeskAccountUser) => ({
  name: user.name,
  display_name: user.name,
  email: user.email,
  status: 1,
  is_admin: user.role === "staff",
  note: "",
});

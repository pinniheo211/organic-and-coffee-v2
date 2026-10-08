import { AccountPage } from "@/components/account-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create an Organic Market account.",
};

export default function RegisterPage() {
  return <AccountPage mode="register" />;
}

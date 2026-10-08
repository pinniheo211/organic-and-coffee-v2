import { AccountPage } from "@/components/account-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Organic Market account.",
};

export default function LoginPage() {
  return <AccountPage mode="login" />;
}

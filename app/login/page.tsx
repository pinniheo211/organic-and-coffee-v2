import { AccountForm } from "@/components/account-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Organic Market account.",
};

export default function LoginPage() {
  return (
    <article data-intro className="mx-auto max-w-xl px-5 py-16 md:py-24">
      <p data-intro-item className="eyebrow">Your account</p>
      <h1 data-intro-item className="mt-3 font-serif text-5xl tracking-[-0.03em] md:text-6xl">Welcome back</h1>
      <div data-intro-item className="mt-8">
        <AccountForm mode="login" />
      </div>
    </article>
  );
}

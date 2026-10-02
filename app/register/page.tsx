import { AccountForm } from "@/components/account-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create an Organic Market account.",
};

export default function RegisterPage() {
  return (
    <article data-intro className="mx-auto max-w-xl px-5 py-16 md:py-24">
      <p data-intro-item className="eyebrow">Your account</p>
      <h1 data-intro-item className="mt-3 font-serif text-5xl tracking-[-0.03em] md:text-6xl">Create an account</h1>
      <div data-intro-item className="mt-8">
        <AccountForm mode="register" />
      </div>
    </article>
  );
}

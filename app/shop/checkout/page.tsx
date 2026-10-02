import { CheckoutForm } from "@/components/checkout-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Preview checkout for the Organic Market online shop.",
};

export default function CheckoutPage() {
  return (
    <article data-intro className="mx-auto max-w-[76rem] px-5 py-16 md:py-24">
      <h1 data-intro-item className="font-serif text-5xl tracking-[-0.03em] md:text-6xl">Checkout</h1>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </article>
  );
}

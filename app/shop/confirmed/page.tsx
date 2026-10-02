import { OrderConfirmation } from "@/components/order-confirmation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order placed",
  description: "A preview order from the Organic Market shop.",
};

export default function ConfirmedPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <h1 className="font-serif text-5xl tracking-[-0.03em] md:text-6xl">Order placed</h1>
      <div className="mt-10">
        <OrderConfirmation />
      </div>
    </article>
  );
}

import { BasketView } from "@/components/basket-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basket",
  description: "Review the Organic Market basket before checkout.",
};

export default function BasketPage() {
  return (
    <article data-intro className="mx-auto max-w-[80rem] px-4 py-12 sm:px-5 md:py-16">
      <h1 data-intro-item className="font-serif text-5xl tracking-[-0.03em] md:text-6xl">Basket</h1>
      <div className="mt-8 md:mt-10">
        <BasketView />
      </div>
    </article>
  );
}

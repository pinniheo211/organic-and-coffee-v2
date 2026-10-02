import { PageHero } from "@/components/page-hero";
import { ShopCatalog } from "@/components/shop-catalog";
import { products } from "@/lib/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop online",
  description:
    "A preview of the Organic Market online shop: produce, bulk foods, grocery, drinks and personal care, for delivery or click and collect.",
};

export default function ShopPage() {
  return (
    <article>
      <PageHero title="Shop online">
        Whole foods from the Stirling shelves. Choose home delivery or click and collect at Druid
        Avenue.
      </PageHero>
      <ShopCatalog products={products} />
    </article>
  );
}

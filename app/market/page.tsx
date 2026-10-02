import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { BotanicalArt } from "@/components/botanical-art";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Market",
  description:
    "High quality produce from local and interstate growers, plus bulk, packaged and free-from foods at the Organic Market in Stirling. Shop in store or online.",
};

export default function MarketPage() {
  return (
    <article>
      <PageHero title="Market" image={{ src: "/assets/store.jpg", alt: "The shop floor, with wine, bulk olives and rows of packaged food" }}>
        Discover the high quality produce sourced directly from both local and interstate growers.
      </PageHero>

      <section>
        <div data-pair className="mx-auto grid max-w-5xl items-center gap-8 px-5 py-10 md:grid-cols-[0.85fr_1.15fr] md:gap-12 md:py-12">
          <div className="relative order-last mx-auto h-52 w-full max-w-sm overflow-hidden md:order-first md:h-64">
            <Image
              src="/assets/shop.jpg"
              alt="The market front at 5 Druid Avenue"
              fill
              sizes="(min-width: 448px) 24rem, calc(100vw - 40px)"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">On the floor</p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] md:text-5xl">
              Browse our market
            </h2>
            <p className="mt-5 max-w-[46ch] text-ink/70">
              The store is packed with gourmet goods, whole foods, fresh fruit and vegetables, and
              sweet treats. With hundreds of lines on the shelves, it is a visual feast to walk and
              look.
            </p>
            <p className="mt-4 max-w-[46ch] text-ink/70">
              We endeavour to cater for all dietary food groups, diets and personal needs, with a
              wide range that is certified organic, preservative free and without genetically
              modified organisms.
            </p>
          </div>
        </div>
      </section>

      <section className="garden-section garden-wash">
        <BotanicalArt className="garden-art garden-art-left" />
        <div data-pair className="mx-auto grid max-w-5xl items-center gap-8 px-5 py-10 md:grid-cols-[1.3fr_0.7fr] md:gap-12 md:py-12">
          <div>
            <p className="eyebrow">Good food</p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] md:text-5xl">
              Passionate for good food
            </h2>
            <p className="mt-5 max-w-[46ch] text-ink/70">
              Enjoy healthy, nutritious, seasonal, fresh certified organic and biodynamic fruit,
              vegetables and foods, along with a wide range of local and regional products.
            </p>
          </div>
          <div className="relative mx-auto h-48 w-full max-w-xs overflow-hidden md:h-56">
            <Image
              src="/assets/IMG_5756.JPG"
              alt="Seasonal fruit and wholefoods from the market, served in the café"
              fill
              sizes="(min-width: 768px) 20rem, (min-width: 360px) 20rem, calc(100vw - 40px)"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-5 py-10 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:py-14">
          <div data-reveal-group className="max-w-[40rem]">
            <p className="eyebrow">Click and collect</p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] md:text-5xl">
              Browse our market or shop online
            </h2>
            <p className="mt-5 max-w-[54ch] text-ink/70">
              There are fresh, bulk and packaged foods, including a comprehensive selection of
              vegan, raw and free-from options for dietary preferences. Everything sold in the shop
              is also online, with home delivery and click and collect.
            </p>
            <p className="mt-6">
              <Link className="btn" href="/shop">Shop online</Link>
            </p>
          </div>
          <div data-gallery className="mx-auto grid w-full max-w-sm grid-cols-2 gap-3">
            <Frame
              src="/assets/660f6cbe607c46603ec10f5c.png"
              alt="The Organic Market delivery van, for click and collect and home delivery"
              fit="contain"
              className="col-span-2 h-32"
            />
            <Frame src="/assets/img2.png" alt="A wholefood bowl from the café kitchen" />
            <Frame src="/assets/img3.jpg" alt="Fresh juices made from market produce" />
          </div>
        </div>
      </section>
    </article>
  );
}

function Frame({
  src,
  alt,
  fit = "cover",
  className,
}: {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  className?: string;
}) {
  return (
    <div className={cn("relative h-36 overflow-hidden bg-recess", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={fit === "contain" ? "24rem" : "12rem"}
        className={fit === "contain" ? "object-contain p-6" : "object-cover"}
      />
    </div>
  );
}

import Link from "next/link";
import { HeroBowlCarousel } from "@/components/hero-bowl-carousel";

export function Hero() {
  return (
    <section
      data-hero
      className="relative flex h-[calc(100dvh-var(--header-h))] flex-col overflow-hidden bg-paper"
    >
      <div data-intro className="z-20 mx-auto w-full max-w-3xl shrink-0 px-5 pt-8 text-center md:pt-12">
        <h1
          data-intro-item
          className="font-serif text-[3.4rem] leading-[0.9] tracking-[-0.04em] md:text-[6.2rem]"
        >
          Organic & whole foods
        </h1>
        <p data-intro-item className="mt-2 font-serif text-2xl italic text-ink/75 md:text-4xl">
          in the heart of Stirling
        </p>
        <p data-intro-item className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/market" className="btn">
            Explore the market
          </Link>
          <Link href="/shop" className="btn-line">
            Shop online
          </Link>
        </p>
      </div>

      <HeroBowlCarousel />
    </section>
  );
}

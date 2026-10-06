"use client";

import { useRef } from "react";
import { HeroBowlCarousel, HERO_DISH_NAMES, INITIAL_HERO_DISH } from "@/components/hero-bowl-carousel";

export function Hero() {
  const caption = useRef<HTMLParagraphElement>(null);

  return (
    <section
      data-hero
      className="relative flex min-h-[calc(100dvh-var(--header-h))] flex-col overflow-hidden bg-paper"
    >
      <div data-intro className="hero-intro z-20 mx-auto w-full max-w-3xl shrink-0 px-5 pt-8 text-center md:pt-16">
        <h1
          data-intro-item
          className="font-serif text-[3.4rem] leading-[0.9] tracking-[-0.04em] md:text-[6.2rem]"
        >
          Organic & whole foods
        </h1>
        <p ref={caption} data-intro-item className="mt-2 grid font-serif text-2xl italic text-ink/75 md:text-4xl">
          {HERO_DISH_NAMES.map((name) => (
            <span
              key={name}
              className="col-start-1 row-start-1"
              style={{ opacity: name === INITIAL_HERO_DISH ? 1 : 0 }}
              aria-hidden={name !== INITIAL_HERO_DISH}
            >
              {name}
            </span>
          ))}
        </p>
        {/* <p data-intro-item className="hero-actions mx-auto mt-8 grid w-full gap-3">
          <Link href="/market" className="btn">
            Explore the market
          </Link>
          <Link href="/shop" className="btn-line">
            Shop online
          </Link>
        </p> */}
      </div>

      <HeroBowlCarousel captionRef={caption} />
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function CafeHero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (!root.current || !stage.current || !photo.current || !shade.current || !headline.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const element = root.current;
    const panel = photo.current;
    const dimmer = shade.current;
    const lines = headline.current.querySelectorAll("[data-cafe-line]");
    const motion = gsap.matchMedia();

    motion.add({
      desktop: "(min-width: 768px)",
      animate: "(prefers-reduced-motion: no-preference)",
    }, (context) => {
      if (!context.conditions?.animate) return;
      let headerHeight = 76;
      const measureHeader = () => {
        headerHeight = document.querySelector("body > header")?.getBoundingClientRect().height ?? 76;
        gsap.set(element, { "--cafe-header-h": `${headerHeight}px` });
      };
      measureHeader();
      gsap.set(lines, { yPercent: 110, autoAlpha: 0 });
      const promote = (active: boolean) => {
        gsap.set(panel, { willChange: active ? "transform" : "auto" });
        gsap.set(dimmer, { willChange: active ? "opacity" : "auto" });
        gsap.set(lines, { willChange: active ? "transform, opacity" : "auto" });
      };
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage.current,
          start: () => `top ${headerHeight}px`,
          end: "bottom bottom",
          scrub: context.conditions.desktop ? 0.85 : 0.65,
          onRefreshInit: measureHeader,
          onToggle: ({ isActive }) => { if (isActive) promote(true); },
          onScrubComplete: (trigger) => { if (!trigger.isActive) promote(false); },
        },
      });
      timeline
        .fromTo(panel, { scale: context.conditions.desktop ? 0.84 : 0.92 }, {
          scale: 1, duration: 0.72, ease: "power2.inOut",
        }, 0)
        .fromTo(dimmer, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power1.inOut" }, 0.3)
        .to(lines, {
          yPercent: 0, autoAlpha: 1, duration: 0.3, stagger: 0.12, ease: "power2.out",
        }, 0.54);
    }, root);

    return () => motion.revert();
  }, []);

  return (
    <header ref={root} className="cafe-scroll-hero">
      <div data-intro className="cafe-banner-heading mx-auto max-w-[76rem] px-5 text-center">
        <p data-intro-item className="eyebrow">Organic coffee · Seasonal food</p>
        <h1 data-intro-item className="mt-4 font-serif text-balance text-ember">The café kitchen</h1>
      </div>

      <div ref={stage} className="cafe-scroll-stage">
        <div className="cafe-scroll-sticky">
          <div ref={photo} className="cafe-scroll-photo">
            <Image
              src="/assets/cafe-shakshouka.png"
              alt="Shakshouka served with toasted sourdough at the café"
              fill
              preload
              sizes="100vw"
              className="object-cover"
            />
            <div ref={shade} className="absolute inset-0 bg-black/45" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center justify-center px-5">
              <h2 ref={headline} className="cafe-banner-message font-serif text-center font-normal text-white">
                <span className="block overflow-hidden"><span data-cafe-line className="block">Simple food.</span></span>
                <span className="block overflow-hidden"><span data-cafe-line className="block">Good company.</span></span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-12 text-center md:py-16" data-reveal data-story-copy>
        <p className="mx-auto max-w-xl text-pretty leading-relaxed text-ink/75">
          Wholesome food and organic coffee, cooked beside the shop that supplies it. Come for
          breakfast, stay for lunch, or take something good with you.
        </p>
        <Link href="/cafe/menu" className="btn mt-6">View menu</Link>
      </div>
    </header>
  );
}

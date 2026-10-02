"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, type ReactNode } from "react";

export function HomeScroll({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !root.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const photo = root.current?.querySelector("[data-pan]");
      const photoWrap = root.current?.querySelector("[data-pan-wrap]");
      if (photo && photoWrap) {
        gsap.fromTo(
          photo,
          { yPercent: 8, scale: 1.12 },
          {
            yPercent: -8,
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: photoWrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return <div ref={root}>{children}</div>;
}

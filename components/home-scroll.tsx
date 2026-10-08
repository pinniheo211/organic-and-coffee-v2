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

      const cafeGallery = root.current?.querySelector<HTMLElement>(".cafe-scroll-gallery");
      const cafeImages = cafeGallery?.querySelectorAll<HTMLElement>("[data-cafe-scroll-image]");
      cafeImages?.forEach((image) => {
        gsap.fromTo(image, { y: 28 }, {
          y: -28,
          ease: "none",
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      });

      const ingredientStory = root.current?.querySelector("#ingredient-story");
      const cafeBackground = cafeGallery?.querySelector<HTMLElement>("[data-cafe-background-transition]");
      if (cafeGallery && ingredientStory && cafeBackground) {
        const galleryIsTallerThanViewport = () => cafeGallery.offsetHeight > window.innerHeight * 1.2;

        const backgroundTransition = gsap.timeline({
          scrollTrigger: {
            trigger: cafeGallery,
            start: () =>
              galleryIsTallerThanViewport() ? "center center" : "top 90%",
            end: "bottom 115%",
            scrub: 0.25,
            invalidateOnRefresh: true,
          },
        });

        backgroundTransition.fromTo(
          cafeBackground,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "none" },
          0,
        );
        backgroundTransition.fromTo(
          cafeGallery,
          { "--cafe-transition-progress": "0%" },
          { "--cafe-transition-progress": "100%", duration: 1, ease: "none" },
          0,
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return <div ref={root}>{children}</div>;
}

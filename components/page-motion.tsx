"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { ViewTransition, useLayoutEffect, useRef, type ReactNode } from "react";

// One shared rhythm for page headings, text blocks, images and galleries.
const reveal = { opacity: 0, y: 28, duration: 0.8, ease: "power3.out", clearProps: "opacity,transform" };
const groupSelector = "[data-pair], [data-gallery], [data-shelf], [data-reveal-group]";

export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const container = root.current;
    if (!container) return;

    gsap.registerPlugin(ScrollTrigger);
    const motion = gsap.matchMedia();
    const animations = new Map<Element, gsap.core.Tween>();

    motion.add("(prefers-reduced-motion: no-preference)", () => {
      container.querySelectorAll("[data-intro]").forEach((intro) => {
        intro.querySelectorAll("[data-intro-item]").forEach((item, index) => {
          animations.set(item, gsap.from(item, { ...reveal, delay: index * 0.1 }));
        });
      });

      function revealOnScroll(element: Element, index = 0) {
        // Reveal each paragraph independently, without also moving its parent.
        if (element.matches("[data-story-copy]")) {
          Array.from(element.children).forEach((child, childIndex) => {
            if (child.matches("ul, ol")) {
              Array.from(child.children).forEach((item, itemIndex) => revealOnScroll(item, itemIndex));
            } else {
              revealOnScroll(child, childIndex);
            }
          });
          return;
        }
        if (animations.has(element)) return;
        animations.set(element, gsap.from(element, {
          ...reveal,
          delay: Math.min(index * 0.1, 0.2),
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        }));
      }

      container.querySelectorAll("[data-reveal]").forEach((element) => revealOnScroll(element));
      container.querySelectorAll(groupSelector).forEach((group) => {
        Array.from(group.children).forEach((element, index) => revealOnScroll(element, index));
      });

      container.querySelectorAll("[data-story-motion] [data-story-photo], [data-story-motion] .page-hero-photo").forEach((frame) => {
        const image = frame.querySelector("img");
        if (!image) return;
        animations.set(image, gsap.from(image, {
          scale: 1.1,
          duration: 1.2,
          ease: "power3.out",
          clearProps: "transform,willChange",
          onStart: () => { gsap.set(image, { willChange: "transform" }); },
          scrollTrigger: { trigger: frame, start: "top 88%", once: true },
        }));
      });

      return () => animations.clear();
    }, root);

    motion.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      container.querySelectorAll("[data-story-motion] .garden-art").forEach((art) => {
        gsap.fromTo(art, { yPercent: 8, rotation: -3 }, {
          yPercent: -8,
          rotation: 3,
          ease: "none",
          scrollTrigger: {
            trigger: art.closest("section"),
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });
    }, root);

    // Keyboard navigation must reveal a focused control immediately.
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      const target = event.target;
      animations.forEach((animation, element) => {
        if (element.contains(target)) animation.progress(1);
      });
    };
    container.addEventListener("focusin", onFocus);

    let disposed = false;
    const refresh = () => { if (!disposed) ScrollTrigger.refresh(); };
    const frame = requestAnimationFrame(refresh);
    const images = Array.from(container.querySelectorAll("img")).filter((image) => !image.complete);
    images.forEach((image) => {
      image.addEventListener("load", refresh, { once: true });
      image.addEventListener("error", refresh, { once: true });
    });
    void document.fonts.ready.then(refresh);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      container.removeEventListener("focusin", onFocus);
      images.forEach((image) => {
        image.removeEventListener("load", refresh);
        image.removeEventListener("error", refresh);
      });
      motion.revert();
    };
  }, [pathname]);

  return (
    <ViewTransition key={pathname} name="page-content" share="page-swap" enter="page-swap" exit="page-swap" default="none">
      <div ref={root}>{children}</div>
    </ViewTransition>
  );
}

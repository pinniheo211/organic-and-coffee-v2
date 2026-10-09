"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import { SplitText } from "@/components/ui/split-text";

function glyphBox(element: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const rect = range.getBoundingClientRect();
  range.detach();
  return rect;
}

export function SiteIntro() {
  const background = useRef<HTMLDivElement>(null);
  const wordmark = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    const logo = document.querySelector<HTMLElement>("[data-site-logo]");
    const backdrop = background.current;
    const title = wordmark.current;
    let cancelled = false;
    let timeline: gsap.core.Timeline | undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !header || !logo || !backdrop || !title) {
      setVisible(false);
      return;
    }

    header.dataset.siteIntroRunning = "true";
    gsap.set(title, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1, transformOrigin: "center center" });

    void document.fonts.ready.then(() => {
      if (cancelled) return;

      const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#171717";
      const flight = { x: 0, y: 0, scale: 1 };

      gsap.set([title, backdrop], { willChange: "transform,opacity" });

      timeline = gsap.timeline({
        onComplete: () => {
          delete header.dataset.siteIntroRunning;
          setVisible(false);
        },
      });

      // Solve the final transform against the live logo so scale does not
      // carry the wordmark past the header and then snap back.
      timeline.call(() => {
        const start = glyphBox(title);
        const target = glyphBox(logo);
        const scale = start.width ? target.width / start.width : 1;
        let x = 0;
        let y = 0;
        for (let i = 0; i < 4; i += 1) {
          gsap.set(title, { x, y, scale });
          const landed = glyphBox(title);
          const dx = target.left + target.width / 2 - (landed.left + landed.width / 2);
          const dy = target.top + target.height / 2 - (landed.top + landed.height / 2);
          x += dx;
          y += dy;
          if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4) break;
        }
        gsap.set(title, { x: 0, y: 0, scale: 1 });
        flight.x = x;
        flight.y = y;
        flight.scale = scale;
      }, undefined, 1.2);

      timeline
        .to(title, {
          x: () => flight.x,
          y: () => flight.y,
          scale: () => flight.scale,
          color: ink,
          duration: 1.42,
          ease: "power2.inOut",
          force3D: true,
          clearProps: "willChange",
          onComplete: () => { delete header.dataset.siteIntroRunning; },
        }, 1.32)
        .to(backdrop, {
          yPercent: -100,
          duration: 1.9,
          ease: "power2.inOut",
          force3D: true,
          clearProps: "willChange",
        }, 1.32)
        .to(backdrop, {
          opacity: 0,
          duration: 1.15,
          ease: "power2.inOut",
        }, 1.32)
        .to(title, { opacity: 0, duration: 0.18, ease: "power2.out" }, 2.74);
    });

    return () => {
      cancelled = true;
      timeline?.kill();
      delete header.dataset.siteIntroRunning;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="site-intro" aria-hidden="true">
      <div ref={background} className="site-intro-background" />
      <div ref={wordmark} className="site-intro-wordmark">
        <SplitText
          text="Organic Market"
          className="site-intro-split"
          tag="span"
          animateOnScroll={false}
          delay={24}
          duration={0.72}
          from={{ opacity: 0, y: 36 }}
          to={{ opacity: 1, y: 0 }}
        />
      </div>
    </div>
  );
}

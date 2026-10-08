"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import { SplitText } from "@/components/ui/split-text";

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

    void document.fonts.ready.then(() => {
      if (cancelled) return;

      const start = title.getBoundingClientRect();
      const target = logo.getBoundingClientRect();
      const x = target.left + target.width / 2 - (start.left + start.width / 2);
      const y = target.top + target.height / 2 - (start.top + start.height / 2);
      const scale = target.width / start.width;
      const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#171717";

      gsap.set([title, backdrop], { willChange: "transform,opacity" });

      timeline = gsap.timeline({
        onComplete: () => {
          delete header.dataset.siteIntroRunning;
          setVisible(false);
        },
      });

      timeline
        .to(title, {
          x,
          y,
          scale,
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
          className="site-intro-split pb-10"
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

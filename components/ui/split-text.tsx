"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GsapSplitText } from "gsap/SplitText";
import { useLayoutEffect, useRef, type CSSProperties } from "react";

type SplitTextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties["textAlign"];
  tag?: SplitTextTag;
  animateOnScroll?: boolean;
};

function getScrollStart(threshold: number, rootMargin: string) {
  const margin = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
  if (!margin) return `top ${(1 - threshold) * 100}%`;

  const value = Number.parseFloat(margin[1]);
  const unit = margin[2] || "px";
  const offset = value === 0 ? "" : value < 0 ? `-=${Math.abs(value)}${unit}` : `+=${value}${unit}`;
  return `top ${(1 - threshold) * 100}%${offset}`;
}

export function SplitText({
  text,
  className = "",
  delay = 30,
  duration = 0.72,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 32 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  animateOnScroll = true,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || !text || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let split: GsapSplitText | undefined;
    let context: gsap.Context | undefined;
    gsap.registerPlugin(ScrollTrigger, GsapSplitText);

    void document.fonts.ready.then(() => {
      if (disposed || !element.isConnected) return;

      context = gsap.context(() => {
        split = new GsapSplitText(element, {
          type: splitType,
          smartWrap: true,
          linesClass: "split-line",
          wordsClass: "split-word",
          charsClass: "split-char",
          reduceWhiteSpace: false,
          aria: "auto",
          onSplit: (instance) => {
            const targets = splitType.includes("chars") && instance.chars.length
              ? instance.chars
              : splitType.includes("words") && instance.words.length
                ? instance.words
                : instance.lines;

            return gsap.fromTo(targets, { ...from }, {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              ...(animateOnScroll ? {
                scrollTrigger: {
                  trigger: element,
                  start: getScrollStart(threshold, rootMargin),
                  once: true,
                  fastScrollEnd: true,
                  anticipatePin: 0.4,
                },
              } : {}),
              willChange: "transform, opacity",
              clearProps: "transform,opacity,willChange",
              force3D: true,
            });
          },
        });
      }, element);

      if (animateOnScroll) ScrollTrigger.refresh();
    });

    return () => {
      disposed = true;
      context?.revert();
      split?.revert();
    };
  }, [animateOnScroll, delay, duration, ease, from, rootMargin, splitType, text, threshold, to]);

  const Tag = tag;
  const style: CSSProperties = {
    textAlign,
    overflow: "hidden",
    display: "inline-block",
    whiteSpace: "normal",
    overflowWrap: "break-word",
  };
  const setRef = (element: HTMLElement | null) => { ref.current = element; };

  return <Tag ref={setRef} style={style} className={`split-parent ${className}`.trim()}>{text}</Tag>;
}

"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type HTMLAttributes } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

export interface RevealImageMaskProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  sizes?: string;
  shape?: "circle" | "rounded";
}

export function RevealImageMask({
  src,
  alt,
  sizes = "100vw",
  shape = "circle",
  className,
  ...props
}: RevealImageMaskProps) {
  const frame = useRef<HTMLDivElement>(null);
  const mask = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!frame.current || !mask.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const element = mask.current;
    const motion = gsap.matchMedia();

    motion.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(element, {
        clipPath: shape === "circle" ? "circle(16% at 50% 50%)" : "inset(30% round 10%)",
      }, {
        clipPath: shape === "circle" ? "circle(75% at 50% 50%)" : "inset(0% round 0%)",
        ease: "none",
        scrollTrigger: {
          trigger: frame.current,
          start: "top 85%",
          end: "center 40%",
          scrub: 0.65,
          onToggle: ({ isActive }) => {
            gsap.set(element, { willChange: isActive ? "clip-path" : "auto" });
          },
        },
      });
    }, frame);

    return () => motion.revert();
  }, [shape]);

  return (
    <div ref={frame} className={cn("relative overflow-hidden", className)} {...props}>
      <div ref={mask} className="absolute inset-0">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}

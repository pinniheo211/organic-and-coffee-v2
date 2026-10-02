"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const bowls = [
  { src: "/assets/product1.webp", alt: "Bircher muesli with strawberries" },
  { src: "/assets/product4.webp", alt: "Banana and coconut bowl" },
  { src: "/assets/product2.webp", alt: "Avocado toast" },
  { src: "/assets/product3.webp", alt: "A bowl of berries, orange and lemon" },
  { src: "/assets/product5.webp", alt: "Grain salad with roasted pumpkin" },

] as const;

const CENTER = 2;
const STEP_DURATION = 0.9;
const STEP_PAUSE = 1.15;

function look(position: number, slot: number) {
  return {
    x: position * slot,
    scale: position === 0 ? 1.12 : Math.abs(position) === 1 ? 0.82 : 0.68,
    opacity: Math.abs(position) === 2 ? 0.58 : 1,
    zIndex: position === 0 ? 2 : 1,
  };
}

export function HeroBowlCarousel() {
  const stage = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const element = stage.current;
    if (!element) return;

    const slots = slotRefs.current.filter((slot): slot is HTMLDivElement => slot !== null);
    if (slots.length === 0) return;

    const ordered = [...slots];
    const images = slots
      .map((slot) => slot.querySelector("img"))
      .filter((image): image is HTMLImageElement => image !== null);
    images.forEach((image) => {
      image.loading = "eager";
    });
    const slotWidth = () => (Number.parseFloat(getComputedStyle(ordered[0]).width) || 0) * 0.82;
    const place = (slot: number) => {
      ordered.forEach((item, index) => gsap.set(item, look(index - CENTER, slot)));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      place(slotWidth());
      return;
    }

    let timeline: gsap.core.Timeline | undefined;
    let pause: gsap.core.Tween | undefined;
    let token = 0;
    let ready = false;
    let disposed = false;

    const build = () => {
      if (!ready) return;
      const current = ++token;
      timeline?.kill();
      pause?.kill();
      const slot = slotWidth();
      if (!slot) return;
      place(slot);

      const runStep = () => {
        const distance = slotWidth();
        const departing = ordered[0];
        timeline = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: STEP_DURATION },
          onComplete: () => {
            if (current !== token) return;
            ordered.push(ordered.shift()!);
            gsap.set(departing, look(2, distance));
            pause = gsap.delayedCall(STEP_PAUSE, runStep);
          },
        });
        ordered.forEach((item, index) => {
          timeline?.to(item, look(index - CENTER - 1, distance), 0);
        });
      };

      pause = gsap.delayedCall(STEP_PAUSE, runStep);
    };

    const resizeObserver = new ResizeObserver(build);
    resizeObserver.observe(element);
    void Promise.all(images.map((image) => image.decode().catch(() => undefined))).then(() => {
      if (disposed) return;
      ready = true;
      build();
    });

    return () => {
      disposed = true;
      token += 1;
      resizeObserver.disconnect();
      timeline?.kill();
      pause?.kill();
      gsap.set(slots, { clearProps: "all" });
    };
  }, []);

  return (
    <div ref={stage} className="hero-bowl-stage" aria-label="A selection of café dishes">
      {bowls.map((bowl, index) => {
        const position = index - CENTER;
        return (
          <div
            key={bowl.src}
            ref={(node) => {
              slotRefs.current[index] = node;
            }}
            className="hero-bowl-item"
            style={{
              left: "50%",
              transform: `translateX(-50%) scale(${position === 0 ? 1.12 : Math.abs(position) === 1 ? 0.82 : 0.68})`,
              opacity: Math.abs(position) === 2 ? 0.58 : 1,
              zIndex: position === 0 ? 2 : 1,
            }}
            aria-hidden="true"
          >
            <Image
              src={bowl.src}
              alt={bowl.alt}
              width={800}
              height={800}
              preload={index === CENTER}
              loading={index === CENTER ? undefined : "eager"}
              sizes="(min-width: 768px) 58vw, 64vw"
              className="h-auto w-full object-contain"
            />
          </div>
        );
      })}
    </div>
  );
}

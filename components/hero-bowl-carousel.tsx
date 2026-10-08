"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

const bowls = [
  { src: "/assets/product1.webp", alt: "Bircher muesli with strawberries", name: "Bircher muesli" },
  { src: "/assets/product4.webp", alt: "Banana and coconut bowl", name: "Banana & coconut" },
  { src: "/assets/product2.webp", alt: "Avocado toast", name: "Avocado toast" },
  { src: "/assets/product3.webp", alt: "A bowl of berries, orange and lemon", name: "Berries & citrus" },
  { src: "/assets/product5.webp", alt: "Grain salad with roasted pumpkin", name: "Roasted pumpkin salad" },
] as const;

// Keep a full sequence on either side. Recycling happens outside the visible
// five positions, while the next bowl is already moving in from the right.
const carouselBowls = [...bowls, ...bowls, ...bowls];
const CENTER = bowls.length + 2;
export const INITIAL_HERO_DISH = carouselBowls[CENTER].name;
export const HERO_DISH_NAMES = bowls.map((bowl) => bowl.name);
const STEP_DURATION = 0.9;
const STEP_PAUSE = 1.15;

function look(position: number, slot: number) {
  return {
    x: position * slot,
    scale: position === 0 ? 1.12 : Math.abs(position) === 1 ? 0.82 : 0.68,
    opacity: Math.abs(position) > 2 ? 0 : Math.abs(position) === 2 ? 0.58 : 1,
    zIndex: position === 0 ? 2 : 1,
  };
}

export function HeroBowlCarousel({ captionRef }: { captionRef: RefObject<HTMLParagraphElement | null> }) {
  const stage = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const element = stage.current;
    if (!element) return;

    const slots = slotRefs.current.filter((slot): slot is HTMLDivElement => slot !== null);
    if (slots.length === 0) return;

    const ordered = [...slots];
    const captions = Array.from(captionRef.current?.querySelectorAll("span") ?? []);
    const captionFor = (item: HTMLDivElement) => captions[slots.indexOf(item) % bowls.length];
    const placeCaption = (item: HTMLDivElement) => {
      const active = captionFor(item);
      captions.forEach((caption) => {
        gsap.set(caption, { opacity: caption === active ? 1 : 0, y: 0, willChange: "auto" });
        caption.setAttribute("aria-hidden", String(caption !== active));
      });
    };
    const images = slots
      .map((slot) => slot.querySelector("img"))
      .filter((image): image is HTMLImageElement => image !== null);
    images.forEach((image) => {
      image.loading = "eager";
    });
    const slotWidth = () => (Number.parseFloat(getComputedStyle(ordered[0]).width) || 0) * 0.82;
    const place = (slot: number) => {
      ordered.forEach((item, index) => gsap.set(item, { ...look(index - CENTER, slot), xPercent: -50 }));
      placeCaption(ordered[CENTER]);
    };
    place(slotWidth());

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const resizeObserver = new ResizeObserver(() => place(slotWidth()));
      resizeObserver.observe(element);
      return () => {
        resizeObserver.disconnect();
        gsap.set(slots, { clearProps: "all" });
        placeCaption(slots[CENTER]);
      };
    }

    let timeline: gsap.core.Timeline | undefined;
    let pause: gsap.core.Tween | undefined;
    let token = 0;
    let ready = false;
    let disposed = false;
    let visible = false;

    const syncPlayback = () => {
      const play = visible && !document.hidden;
      timeline?.paused(!play);
      pause?.paused(!play);
    };

    const build = () => {
      if (!ready) return;
      const current = ++token;
      timeline?.kill();
      pause?.kill();
      const slot = slotWidth();
      if (!slot) return;
      place(slot);

      const runStep = () => {
        const distance = slot;
        const departing = ordered[0];
        timeline = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: STEP_DURATION },
          onComplete: () => {
            if (current !== token) return;
            ordered.push(ordered.shift()!);
            gsap.set(departing, look(ordered.length - CENTER - 1, distance));
            gsap.set(slots, { willChange: "auto" });
            gsap.set(captions, { willChange: "auto" });
            pause = gsap.delayedCall(STEP_PAUSE, runStep);
            syncPlayback();
          },
        });
        ordered.forEach((item, index) => {
          if (index - CENTER >= -2 && index - CENTER <= 3) {
            gsap.set(item, { willChange: "transform, opacity" });
          }
          timeline?.to(item, look(index - CENTER - 1, distance), 0);
        });
        const outgoing = captionFor(ordered[CENTER]);
        const incoming = captionFor(ordered[CENTER + 1]);
        if (outgoing && incoming) {
          timeline
            .set([outgoing, incoming], { willChange: "transform, opacity" }, 0)
            .to(outgoing, { opacity: 0, y: -10, duration: 0.3 }, 0.15)
            .set(outgoing, { attr: { "aria-hidden": "true" } }, 0.45)
            .set(incoming, { attr: { "aria-hidden": "false" } }, 0.45)
            .fromTo(incoming, { opacity: 0, y: 10 }, {
              opacity: 1, y: 0, duration: 0.4, ease: "power2.out", immediateRender: false,
            }, 0.45);
        }
        syncPlayback();
      };

      pause = gsap.delayedCall(STEP_PAUSE, runStep);
      syncPlayback();
    };

    const resizeObserver = new ResizeObserver(build);
    resizeObserver.observe(element);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    visibilityObserver.observe(element);
    document.addEventListener("visibilitychange", syncPlayback);
    void Promise.all(images.map((image) => image.decode().catch(() => undefined))).then(() => {
      if (disposed) return;
      ready = true;
      build();
    });

    return () => {
      disposed = true;
      token += 1;
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      timeline?.kill();
      pause?.kill();
      gsap.set(slots, { clearProps: "all" });
      placeCaption(slots[CENTER]);
    };
  }, [captionRef]);

  return (
    <div ref={stage} className="hero-bowl-stage" aria-label="A selection of café dishes">
      {carouselBowls.map((bowl, index) => {
        const position = index - CENTER;
        return (
          <div
            key={`${bowl.src}-${index}`}
            ref={(node) => {
              slotRefs.current[index] = node;
            }}
            className="hero-bowl-item"
            style={{
              left: "50%",
              transform: `translateX(calc(-50% + var(--bowl-size) * ${position * 0.82})) scale(${position === 0 ? 1.12 : Math.abs(position) === 1 ? 0.82 : 0.68})`,
              opacity: Math.abs(position) > 2 ? 0 : Math.abs(position) === 2 ? 0.58 : 1,
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
              sizes="(min-width: 1104px) 640px, (min-width: 768px) 58vw, (min-width: 498px) 448px, 90vw"
              className="h-auto w-full object-contain"
            />
          </div>
        );
      })}
    </div>
  );
}

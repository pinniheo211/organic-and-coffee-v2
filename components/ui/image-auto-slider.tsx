"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import gsap from "gsap";
import { useLayoutEffect, useRef, useState, type FocusEvent as ReactFocusEvent } from "react";

export interface ImageAutoSliderImage {
  src: string;
  alt: string;
}

export interface ImageAutoSliderProps {
  images: ImageAutoSliderImage[];
  label?: string;
  duration?: number;
  className?: string;
}

/** A seamless, responsive image marquee that pauses off-screen and on request. */
export function ImageAutoSlider({
  images,
  label = "Market food gallery",
  duration = 34,
  className = "",
}: ImageAutoSliderProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const visibleRef = useRef(false);
  const manuallyPausedRef = useRef(false);
  const pointerInsideRef = useRef(false);
  const focusInsideRef = useRef(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const sequence = sequenceRef.current;
    if (!viewport || !track || !sequence) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let disposed = false;
    const syncPlayback = () => {
      tweenRef.current?.paused(
        !visibleRef.current ||
          manuallyPausedRef.current ||
          pointerInsideRef.current ||
          focusInsideRef.current ||
          document.hidden,
      );
    };

    const buildTween = () => {
      if (disposed) return;
      const distance = sequence.getBoundingClientRect().width;
      if (!distance) return;

      tweenRef.current?.kill();
      gsap.set(track, { x: 0 });
      tweenRef.current = gsap.to(track, {
        x: -distance,
        duration,
        ease: "none",
        repeat: -1,
        paused: true,
      });
      syncPlayback();
    };

    const resizeObserver = new ResizeObserver(buildTween);
    resizeObserver.observe(sequence);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      syncPlayback();
    });
    visibilityObserver.observe(viewport);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      tweenRef.current?.kill();
      tweenRef.current = null;
      gsap.set(track, { clearProps: "transform" });
    };
  }, [duration, images.length]);

  const togglePause = () => {
    const next = !manuallyPausedRef.current;
    manuallyPausedRef.current = next;
    setManuallyPaused(next);
    tweenRef.current?.paused(
      next ||
        !visibleRef.current ||
        pointerInsideRef.current ||
        focusInsideRef.current ||
        document.hidden,
    );
  };

  const handlePointerEnter = () => {
    pointerInsideRef.current = true;
    tweenRef.current?.pause();
  };

  const handlePointerLeave = () => {
    pointerInsideRef.current = false;
    tweenRef.current?.paused(
      manuallyPausedRef.current || !visibleRef.current || focusInsideRef.current || document.hidden,
    );
  };

  const handleFocus = () => {
    focusInsideRef.current = true;
    tweenRef.current?.pause();
  };

  const handleBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    focusInsideRef.current = false;
    tweenRef.current?.paused(
      manuallyPausedRef.current || !visibleRef.current || pointerInsideRef.current || document.hidden,
    );
  };

  return (
    <div className={`image-auto-slider ${className}`}>
     
      <div
        ref={viewportRef}
        className="image-auto-slider-viewport"
        role="region"
        aria-label={label}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocusCapture={handleFocus}
        onBlurCapture={handleBlur}
      >
        <div ref={trackRef} className="image-auto-slider-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              ref={copy === 0 ? sequenceRef : undefined}
              className="image-auto-slider-sequence"
              aria-hidden={copy === 1}
            >
              {images.map((image, index) => (
                <div className="image-auto-slider-card" key={`${image.src}-${index}`}>
                  <Image
                    src={image.src}
                    alt={copy === 0 ? image.alt : ""}
                    fill
                    sizes="(min-width: 1280px) 22rem, (min-width: 768px) 30vw, 78vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

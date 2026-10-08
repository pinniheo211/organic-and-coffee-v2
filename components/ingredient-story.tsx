"use client";

import { useLayoutEffect, useRef, useState, type AnimationEvent, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type IngredientItem = {
  src: string;
  alt: string;
  label: string;
  title: string;
  text: string;
  note: string;
  href: string;
  link: string;
};

const STEP_MS = 6400;

const themes = [
  {
    bg: "#1a2e26",
    ink: "#f7f2e8",
    line: "#f3d7ae",
    path: "M-80 520C50 480 150 445 270 450S470 525 610 435 785 250 930 305 1120 500 1270 400 1460 265 1680 205",
  },
  {
    bg: "#3b2419",
    ink: "#fff1df",
    line: "#ef9569",
    path: "M-80 330C80 150 220 150 300 340S460 565 590 365 760 120 900 300 1080 565 1220 375 1450 185 1680 350",
  },
  {
    bg: "#193526",
    ink: "#edf5e8",
    line: "#8fcf9b",
    path: "M-80 600C90 590 170 515 255 430S380 350 470 415 560 500 640 385 760 170 870 190 940 335 1030 300 1150 120 1230 135 1430 220 1680 120",
  },
  {
    bg: "#15352f",
    ink: "#e9f6ee",
    line: "#70d1bd",
    path: "M-80 430C35 430 60 320 175 300S310 530 430 540 560 280 685 280 830 490 950 490 1100 250 1220 250 1380 420 1680 370",
  },
] as const;

export function IngredientStory({ items }: { items: readonly IngredientItem[] }) {
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(false);
  const generation = useRef(0);
  const theme = themes[active % themes.length];

  useLayoutEffect(() => {
    const section = document.getElementById("ingredient-story");
    if (!section) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (motion.matches) {
        setReduced(true);
        setEntered(true);
      }
    };
    apply();
    motion.addEventListener("change", apply);
    if (motion.matches) return () => motion.removeEventListener("change", apply);

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setEntered(true);
      observer.disconnect();
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", apply);
    };
  }, []);

  useLayoutEffect(() => {
    const cafeGallery = document.querySelector<HTMLElement>(".cafe-scroll-gallery");
    if (!cafeGallery) return;
    cafeGallery.style.setProperty("--cafe-transition-bg", theme.bg);
    cafeGallery.style.setProperty("--cafe-transition-ink", theme.ink);
  }, [theme.bg, theme.ink]);

  function select(index: number) {
    generation.current += 1;
    setActive(index);
  }

  function advance(event: AnimationEvent<HTMLSpanElement>) {
    if (reduced || event.animationName !== "ingredient-step-fill") return;
    const started = Number(event.currentTarget.dataset.generation);
    setActive((current) => (generation.current === started ? (current + 1) % items.length : current));
  }

  const themeStyle = {
    "--ingredient-bg": theme.bg,
    "--ingredient-ink": theme.ink,
  } as CSSProperties;

  return (
    <section
      id="ingredient-story"
      className={`ingredient-explorer section-ornament${entered ? " is-entered" : ""}`}
      style={themeStyle}
      aria-labelledby="ingredient-title"
    >
      <div className="ingredient-scribbles" aria-hidden="true">
        {themes.map((entry, index) => (
          <svg
            key={entry.line}
            className={`ingredient-scribble${index === active % themes.length ? " is-active" : ""}`}
            style={{ color: entry.line }}
            viewBox="-300 0 2200 700"
            fill="none"
          >
            <path d={entry.path} pathLength="1" />
          </svg>
        ))}
      </div>
      <div className="ingredient-explorer-inner">
        <header className="ingredient-explorer-heading">
          <p className="eyebrow">From our kitchen</p>
          <h2 id="ingredient-title" className="font-casa-leru">Good food, good ingredients.</h2>
          <p className="ingredient-explorer-subtitle">Seasonal, local and organic wherever possible.</p>
        </header>

        <div className="ingredient-explorer-layout">
          <ul className="ingredient-selector" aria-label="Explore our food and ingredients">
            {items.map((entry, index) => (
              <li key={entry.label} data-active={active === index ? "true" : "false"}>
                <button
                  type="button"
                  aria-current={active === index ? "step" : undefined}
                  aria-controls="ingredient-feature"
                  onClick={() => select(index)}
                >
                  <span>{entry.label}</span>
                  <span className="ingredient-step-line" aria-hidden="true">
                    <span
                      key={active === index ? `fill-${generation.current}` : "fill"}
                      className="ingredient-step-fill"
                      data-generation={generation.current}
                      style={active === index ? { animationDuration: `${STEP_MS}ms` } : undefined}
                      onAnimationEnd={active === index ? advance : undefined}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div id="ingredient-feature" className="ingredient-feature">
            <figure className="ingredient-feature-figure">
              <div className="ingredient-feature-photo">
                {items.map((entry, index) => {
                  const state = index === active ? "active" : index < active ? "past" : "future";
                  return (
                    <div key={entry.src} className={`ingredient-photo-layer is-${state}`}>
                      <Image
                        src={entry.src}
                        alt={index === active ? entry.alt : ""}
                        aria-hidden={index !== active}
                        fill
                        sizes="(min-width: 1024px) 320px, (min-width: 768px) 46vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  );
                })}
              </div>
              <figcaption>Prepared at our café in Stirling</figcaption>
            </figure>

            <div className="ingredient-feature-copy" aria-live="polite">
              <p className="eyebrow">{items[active].label}</p>
              <h3 className="font-serif">{items[active].title}</h3>
              <p className="ingredient-feature-description">{items[active].text}</p>
              <p className="ingredient-feature-note">{items[active].note}</p>
              <Link href={items[active].href} className="ingredient-feature-link">
                {items[active].link}<ArrowUpRight size={19} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
const scribbleSides = ["left", "right"] as const;
const roundLoop = "M600 150C848.5 150 1050 351.5 1050 600C1050 848.5 848.5 1050 600 1050C351.5 1050 150 848.5 150 600C150 351.5 351.5 150 600 150Z";

const themes = [
  {
    bg: "#d4edc8",
    ink: "#102418",
    line: "#146b38",
  },
  {
    bg: "#f6d9b8",
    ink: "#2a1408",
    line: "#e24e1c",
  },
  {
    bg: "#1a2e26",
    ink: "#f7f2e8",
    line: "#f3d7ae",
  },
  {
    bg: "#d7f3e4",
    ink: "#0e241c",
    line: "#0b6e62",
  },
] as const;

export function IngredientStory({ items }: { items: readonly IngredientItem[] }) {
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(false);
  const generation = useRef(0);

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

  function select(index: number) {
    generation.current += 1;
    setActive(index);
  }

  function advance(event: AnimationEvent<HTMLSpanElement>) {
    if (reduced || event.animationName !== "ingredient-step-fill") return;
    const started = Number(event.currentTarget.dataset.generation);
    setActive((current) => (generation.current === started ? (current + 1) % items.length : current));
  }

  const theme = themes[active % themes.length];
  const themeStyle = {
    "--ingredient-bg": theme.bg,
    "--ingredient-ink": theme.ink,
    "--ingredient-line": theme.line,
  } as CSSProperties;

  return (
    <section
      id="ingredient-story"
      className={`ingredient-explorer section-ornament${entered ? " is-entered" : ""}`}
      style={themeStyle}
      aria-labelledby="ingredient-title"
    >
      <div className="ingredient-scribbles" aria-hidden="true">
        {themes.flatMap((entry, index) =>
          scribbleSides.map((side) => (
            <svg
              key={`${entry.line}-${side}`}
              className={`ingredient-scribble ingredient-scribble-${side}${index === active % themes.length ? " is-active" : ""}`}
              style={{ color: entry.line }}
              viewBox="0 0 1200 1200"
              fill="none"
            >
              <path
                d={roundLoop}
                pathLength="1"
                transform={side === "right" ? "translate(1200 0) scale(-1 1)" : undefined}
              />
            </svg>
          )),
        )}
      </div>
      <div className="ingredient-explorer-inner">
        <header className="ingredient-explorer-heading">
          <p className="eyebrow">From our kitchen</p>
          <h2 id="ingredient-title" className="font-serif">Good food, from <em>good ingredients.</em></h2>
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

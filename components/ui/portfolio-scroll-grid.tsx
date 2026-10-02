import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface PortfolioScrollGridImage {
  src: string;
  alt: string;
}

export interface PortfolioScrollGridProps {
  /** Name pinned to the centre of the viewport, behind the photos. */
  title: React.ReactNode;
  /** Photos, recycled to fill the grid. Pass 8 or more to avoid neighboring repeats. */
  images: PortfolioScrollGridImage[];
  /** Grid rows — sets how long the section scrolls. Default `8`. */
  rows?: number;
  className?: string;
}

const COLUMNS = 5;
const CENTER = 2;
const COL = 26.98;
const ROW = 32.23;
const BOX_W = 22;
const BOX_H = 21.24;
const TITLE = 5.63;

const u = (n: number) => `calc(var(--u) * ${n})`;
const PHASE = `mod(50vh - ${u(ROW / 2)}, ${u(ROW)})`;

/** A CSS-only pinned title with a staggered photo grid scrolling over it. */
export function PortfolioScrollGrid({
  title,
  images,
  rows = 8,
  className,
}: PortfolioScrollGridProps) {
  return (
    <section
      className={cn("relative w-full overflow-clip bg-paper", className)}
      style={
        {
          containerType: "inline-size",
          "--u": "max(1cqw, 5.5px)",
        } as React.CSSProperties
      }
    >
      <div className="mx-auto grid max-w-md gap-5 px-5 py-12 md:hidden">
        <h2 className="text-center font-serif text-4xl leading-tight text-ink">{title}</h2>
        <div className="grid grid-cols-2 gap-3">
          {images.slice(0, 4).map((image) => (
            <div key={image.src} className="relative aspect-[4/3] overflow-hidden bg-recess">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                decoding="async"
                sizes="(max-width: 639px) calc(50vw - 1.25rem), 10rem"
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block">
        <div className="absolute inset-0">
          <div className="sticky top-0 flex h-screen items-center justify-center px-4">
            <h2
              className="text-center font-extrabold uppercase leading-none tracking-tight text-ink"
              style={{ fontSize: u(TITLE) }}
            >
              {title}
            </h2>
          </div>
        </div>

        <div
          className="relative flex justify-center"
          style={{ marginTop: `calc(${PHASE} - ${u(ROW)})` }}
        >
          {Array.from({ length: COLUMNS }, (_, c) => (
            <div
              key={c}
              className="shrink-0"
              style={{
                width: u(COL),
                transform:
                  c === CENTER
                    ? `translateY(calc(50vh - ${PHASE} + ${u(ROW * 1.5)}))`
                    : c % 2
                      ? `translateY(${u(ROW / 2)})`
                      : undefined,
              }}
            >
              {Array.from({ length: rows }, (_, r) => {
                const image = images[(r + c * 3) % images.length];

                return (
                  <div key={r} className="flex items-center justify-center" style={{ height: u(ROW) }}>
                    {image && (
                    <Image
                        src={image.src}
                        alt={image.alt}
                      width={600}
                      height={600}
                        loading="lazy"
                        decoding="async"
                        className="object-contain"
                      sizes="(min-width: 768px) 22vw, 50vw"
                        style={{ width: u(BOX_W), height: u(BOX_H) }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

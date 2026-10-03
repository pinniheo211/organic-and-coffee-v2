import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function PageHero({
  title,
  eyebrow,
  image,
  children,
  className,
}: {
  title: ReactNode;
  eyebrow?: string;
  image?: { src: string; alt: string; position?: string; caption?: string; sizes?: string };
  children: ReactNode;
  className?: string;
}) {
  return (
    <header data-intro className={cn("page-hero", image && "page-hero-split", className)}>
      {!image && <>
        {/* <BotanicalArt className="page-hero-art page-hero-art-left" /> */}
        {/* <BotanicalArt variant="coffee" className="page-hero-art page-hero-art-right" /> */}
      </>}
      <div className={cn("relative z-10", !image && "mx-auto max-w-[46rem]")}>
        {eyebrow ? <p data-intro-item className="eyebrow">{eyebrow}</p> : null}
        <h1
          data-intro-item
          className={cn("font-serif text-[2.6rem] leading-[1.08] tracking-[-0.03em] text-balance md:text-6xl", eyebrow && "mt-4")}
        >
          {title}
        </h1>
        <div data-intro-item className={cn("mt-5 max-w-[36rem] text-pretty text-ink/65", !image && "mx-auto")}>{children}</div>
      </div>
      {image && (
        <div data-intro-item className="page-hero-photo">
          <Image src={image.src} alt={image.alt} fill priority sizes={image.sizes ?? "(min-width: 768px) 26rem, (min-width: 448px) 24rem, calc(100vw - 40px)"} className="object-cover" style={{ objectPosition: image.position }} />
          {image.caption && <span className="page-hero-caption">{image.caption}</span>}
        </div>
      )}
    </header>
  );
}

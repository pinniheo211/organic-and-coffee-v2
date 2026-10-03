import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Coffee, Heart, Leaf } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { BotanicalArt } from "@/components/botanical-art";
import { phoneDisplay, phoneHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Café",
  description:
    "Vegetarian café at the Organic Market in Stirling. Seasonal salads and soups, D'Angelo organic coffee, and room for most dietary requirements.",
};

const kitchenNotes = [
  {
    title: "Cooked with the season",
    text: "Salads, soups and a daily special are made with fresh produce, organic wherever the kitchen can get it.",
    icon: Leaf,
  },
  {
    title: "Vegetarian at heart",
    text: "A vegetarian-first menu, with vegan, dairy-free, gluten-free and sugar-free choices available.",
    icon: Heart,
  },
  {
    title: "Coffee worth pausing for",
    text: "Organic D’Angelo coffee, served with Paris Creek organic milk or your choice of alternative.",
    icon: Coffee,
  },
] as const;

const cafePhotos = [
  { src: "/assets/cfs1.png", alt: "A painting on the café wall above the wine shelf", className: "cafe-photo-main" },
  { src: "/assets/cfs2.png", alt: "The café wall with local art and daily special boards", className: "cafe-photo-side" },
  { src: "/assets/cafe-salad-bowl.png", alt: "A fresh café salad bowl with seasonal vegetables", className: "cafe-photo-detail" },
] as const;

export default function CafePage() {
  return (
    <article data-story-motion className="cafe-page">
      <PageHero
        title="The café kitchen"
        eyebrow="Simple food · good company"
        className="cafe-page-hero"
        image={{ src: "/assets/cafe-shakshouka.jpg", alt: "Shakshouka served with toasted sourdough at the café" }}
      >
        <span className="block">
          Wholesome food and organic coffee, cooked beside the shop that supplies it. Come for
          breakfast, stay for lunch, or take something good with you.
        </span>
        <Link href="/cafe/menu" className="btn mt-6">
          View menu
        </Link>
      </PageHero>

      <section aria-labelledby="cafe-kitchen-title" className="cafe-kitchen-section">
        <div className="mx-auto max-w-[76rem] px-5 py-16 md:py-24">
          <div className="cafe-kitchen-heading" data-reveal>
            <p className="eyebrow">From the kitchen</p>
            <h2 id="cafe-kitchen-title" className="mt-3 max-w-[20ch] font-serif text-4xl leading-tight text-balance md:text-6xl">
              Made simply, with care
            </h2>
            <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-pretty text-ink/70 md:text-base">
              The menu follows what is fresh, with familiar café favourites and room for different
              ways of eating.
            </p>
          </div>

          <div className="cafe-kitchen-grid mt-10 md:mt-14" data-shelf>
            {kitchenNotes.map(({ title, text, icon: Icon }) => (
              <article key={title} className="cafe-kitchen-note">
                <Icon size={28} strokeWidth={1.4} aria-hidden="true" className="text-ember" />
                <h3 className="mt-5 font-serif text-2xl leading-tight text-balance md:text-3xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-pretty text-ink/70">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Inside the café" className="cafe-gallery-section">
        <div className="cafe-gallery mx-auto max-w-[76rem] px-5 py-12 md:py-16" data-gallery>
          {cafePhotos.map((photo) => (
            <div key={photo.src} className={`cafe-gallery-photo ${photo.className}`} data-story-photo>
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 38rem, 100vw" className="object-cover" />
            </div>
          ))}
          <p className="cafe-gallery-caption font-serif italic text-ember">A little room to slow down.</p>
        </div>
      </section>

      <section className="cafe-order-section">
        {/* <BotanicalArt variant="coffee" className="garden-art garden-art-right" /> */}
        <div className="mx-auto grid max-w-[76rem] gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:gap-16 md:py-20">
          <div data-reveal>
            <p className="eyebrow">Settle in or take away</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-balance md:text-5xl">Your café, your way</h2>
            <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-pretty text-ink/75 md:text-base">
              Order at the table using the QR code, from the counter, or from the café window if
              you’re on the go. Takeaway is made while you wait.
            </p>
            <Link href="/cafe/menu" className="btn mt-7 inline-flex min-h-12 items-center gap-3">
              See the café menu <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="cafe-art-note" data-reveal>
            <p className="eyebrow">A place for the Hills</p>
            <h3 className="mt-3 font-serif text-3xl leading-tight text-balance">Good food, good art, good people.</h3>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              The café holds a Green Table Award from Environmental Sustainable Savour. Each month,
              the room also makes space for local art, textiles, jewellery and pottery.
            </p>
            <p className="mt-5 text-sm">
              Ask for Elle on <a className="link" href={phoneHref}>{phoneDisplay}</a>.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}

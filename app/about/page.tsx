import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The Organic Market and Café has connected organic growers with Adelaide Hills households since 1982. Meet the people and story behind Stirling’s local market.",
};

export default function AboutPage() {
  return (
    <article className="about-page" data-story-motion>
      <section className="about-hero" aria-labelledby="about-title">
        <figure className="about-hero-image" data-story-photo>
          <Image
            src="/assets/store.jpg"
            alt="The inside of the Organic Market, with shelves of wine and wholefood groceries"
            fill
            priority
            sizes="(min-width: 1280px) 75rem, calc(100vw - 2.5rem)"
            className="object-cover"
          />
        </figure>
        <div className="about-hero-copy" data-intro>
          <p data-intro-item className="eyebrow">A Stirling original · Since 1982</p>
          <h1 data-intro-item id="about-title" className="about-title">
            Good food has a <em>long story.</em>
          </h1>
          <p data-intro-item className="about-lede">
            We are an independent market and café in the Adelaide Hills, bringing good growers,
            good food and our local community together for more than four decades.
          </p>
        </div>
      </section>
      <section className="about-values" aria-labelledby="values-title">
        <div className="about-values-image" data-story-photo>
          <Image
            src="/assets/cafe-salad-bowl.png"
            alt="A colourful café salad made with seasonal ingredients"
            fill
            sizes="(min-width: 768px) 48vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="about-values-copy" data-story-copy>
          <p className="eyebrow">From our shelves to your table</p>
          <h2 id="values-title" className="about-section-title">The way we <em>choose.</em></h2>
          <p>
            We look for certified organic and biodynamic food, seasonal produce and trusted
            growers. When a product does not meet that standard, we aim to be clear about it.
            Our café carries that same thinking into a vegetarian kitchen, with food made beside
            the market that supplies it.
          </p>
          <div className="about-links">
            <Link href="/market" className="btn">Explore the market <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <Link href="/cafe" className="btn-line">Meet the café <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </article>
  );
}

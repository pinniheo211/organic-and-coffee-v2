import { SectionLine } from "@/components/section-line";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ScrollImageHero } from "@/components/scroll-image-hero";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The Organic Market and Café has connected organic growers with Adelaide Hills households since 1982. Meet the people and story behind Stirling’s local market.",
};

export default function AboutPage() {
  return (
    <article className="about-page" data-story-motion>
      <ScrollImageHero
        title="Good food has a long story."
        eyebrow="A Stirling original · Since 1982"
        image={{ src: "/assets/story2.jpeg", alt: "A team member serving a customer at the Organic Market counter" }}
        lines={["Good food has a", "long story."]}
        titlePlacement="overlay"
        className="about-scroll-hero"
      >
        We are an independent market and café in the Adelaide Hills, bringing good growers,
        good food and our local community together for more than four decades.
      </ScrollImageHero>
      <section className="about-values section-ornament" aria-labelledby="values-title">
        <SectionLine variant="trail" className="section-line-about" />
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

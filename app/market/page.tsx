import type { Metadata } from "next";
import { SectionLine } from "@/components/section-line";
import { ScrollImageHero } from "@/components/scroll-image-hero";
import { ImageAutoSlider } from "@/components/ui/image-auto-slider";
import { ImageTrail } from "@/components/ui/image-trail";

export const metadata: Metadata = {
  title: "Market",
  description:
    "High quality produce from local and interstate growers, plus bulk, packaged and free-from foods at the Organic Market in Stirling. Shop in store or online.",
};

const marketGallery = [
  { src: "/assets/img1.webp", alt: "A fresh grain and vegetable bowl with greens" },
  { src: "/assets/img2.webp", alt: "A bowl of fruit, coconut and seasonal ingredients" },
  { src: "/assets/IMG_5756.webp", alt: "Seasonal berries, fruit and wholefoods" },
  { src: "/assets/img3.webp", alt: "Fresh juice made with market produce" },
  { src: "/assets/juice1.webp", alt: "A freshly pressed juice" },
  { src: "/assets/break1.webp", alt: "A café dish made with fresh ingredients" },
  { src: "/assets/break3.webp", alt: "Seasonal food served at the café" },
  { src: "/assets/shop.webp", alt: "The Organic Market in Stirling" },
] as const;

const marketTrailItems = marketGallery.map((image) => image.src);

export default function MarketPage() {
  return (
    <article data-story-motion className="market-page">
      <ScrollImageHero
        title="A good food market"
        titleClassName="font-casa-leru"
        eyebrow="Organic Market · Stirling"
        image={{ src: "/assets/store.webp", alt: "Shelves of pantry goods and fresh produce inside the Organic Market" }}
        lines={["Browse", "our Market."]}
        action={{ href: "/shop", label: "Shop online" }}
        className="market-scroll-hero"
      >
        Discover produce from local growers, wholefood staples and regional finds for everyday meals.
      </ScrollImageHero>

      <section aria-labelledby="market-ranges-title" className="market-ranges-section section-ornament">
        <SectionLine className="section-line-market" />
        <div className="market-ranges-pad mx-auto max-w-[76rem] px-5 py-16 md:py-24">
          <div className="market-section-heading" data-reveal>
            <div>
              <p className="eyebrow">A little of everything, chosen well</p>
              <h2 id="market-ranges-title" className="mt-3 max-w-[18ch] font-serif text-4xl leading-tight text-balance md:text-6xl">
                Good food starts with good ingredients
              </h2>
            </div>
            <div className="market-section-copy max-w-md">
              <p className="text-sm leading-relaxed text-pretty text-ink/70 md:text-base">
                Our shelves bring together the things you cook with every day and the local discoveries
                that make a meal memorable.
              </p>
            </div>
          </div>

          <div className="market-ranges-slider">
            <ImageAutoSlider images={[...marketGallery]} className="mt-10 md:mt-14" />
          </div>
        </div>
        <div className="market-ingredient-trail">
          <ImageTrail items={marketTrailItems} variant={1} />
        </div>
      </section>

      {/* <section className="market-care-section">
        <BotanicalArt className="garden-art garden-art-left" />
        <div className="mx-auto grid max-w-[76rem] gap-10 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-16 md:py-20">
          <div data-reveal>
            <p className="eyebrow">More than a shop</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-balance md:text-5xl">A market with its roots in the Hills</h2>
            <p className="mt-5 max-w-[43ch] text-sm leading-relaxed text-pretty text-ink/75 md:text-base">
              {departments[0].detail} We also stock bulk staples, packaged foods for a range of
              dietary needs, and products from producers we are glad to support.
            </p>
          </div>
          <div className="market-department-strip" data-shelf>
            {departments.slice(0, 4).map((department) => (
              <div key={department.name} className="market-department">
                <h3 className="font-serif text-xl">{department.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{department.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </article>
  );
}

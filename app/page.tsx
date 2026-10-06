import { Hero } from "@/components/hero";
import { HomeScroll } from "@/components/home-scroll";
import { HoursTable } from "@/components/hours-table";
import { PortfolioScrollGrid } from "@/components/ui/portfolio-scroll-grid";
import { RevealImageMask } from "@/components/ui/reveal-image-mask";
import { address, mapsUrl, phoneDisplay, phoneHref } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const reasons = [
  {
    title: "Good for the planet",
    text: "We choose sustainable, seasonal products and say no to the industrial food system.",
  },
  {
    title: "Kind to animals",
    text: "We look for ethically reared and free-range products, alongside organic and biodynamic foods.",
  },
  {
    title: "Backing local producers",
    text: "Wherever possible, we partner with local suppliers and growers from the Adelaide Hills and beyond.",
  },
] as const;

const gallery = [
  {
    src: "/assets/store.jpg", alt: "Inside the Organic Market",
    label: "The market", title: "Good things, every day",
    text: "Organic produce, whole foods and everyday favourites, thoughtfully chosen for your pantry.",
    href: "/market", link: "Explore the market",
  },
  {
    src: "/assets/bar.png", alt: "The café bar",
    label: "The café", title: "Make time for a coffee",
    text: "Organic coffee and simple, wholesome food with a vegetarian focus. Settle in and stay a little.",
    href: "/cafe", link: "Discover our café",
  },
  {
    src: "/assets/shop.jpg", alt: "The Organic Market shopfront",
    label: "Stirling, Adelaide Hills", title: "A little closer to local",
    text: "Find us at 5 Druid Avenue, in the heart of Stirling. Drop in for your groceries or a leisurely lunch.",
    href: "/visit", link: "Plan your visit",
  },
  {
    src: "/assets/cfs3.png", alt: "The café space in Stirling",
    label: "At the table", title: "Something worth staying for",
    text: "Seasonal dishes, fresh juices and café favourites. Take a look at what’s on the menu.",
    href: "/cafe/menu", link: "See our menu",
  },
] as const;

const cafeImages = [
  { src: "/assets/cfs1.png", alt: "A view inside the café" },
  { src: "/assets/cfs2.png", alt: "The café wall and daily boards" },
  { src: "/assets/img3.jpg", alt: "A view from the Organic Market" },
  { src: "/assets/break1.jpg", alt: "Breakfast at the café" },
  { src: "/assets/break2.jpg", alt: "A café breakfast dish" },
  { src: "/assets/break3.jpg", alt: "Fresh food from the café" },
  { src: "/assets/break4.jpg", alt: "A breakfast dish made with fresh produce" },
  { src: "/assets/juice1.jpg", alt: "Fresh juice from the café" },
  { src: "/assets/juice2.jpg", alt: "A freshly prepared café juice" },
] as const;

export default function HomePage() {
  return (
    <HomeScroll>
      <Hero />

      {/* <section aria-labelledby="market-heading" className="garden-section garden-wash">
        <BotanicalArt className="garden-art garden-art-left" />
        <div
          className="mx-auto grid max-w-[76rem] items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24"
          data-pair
        >
          <div>
            <h2 id="market-heading" className="max-w-[12ch] font-serif text-4xl leading-[1.05] tracking-[-0.03em] md:text-6xl">
              A market full of good things
            </h2>
            <p className="mt-3 font-serif text-2xl italic text-ink/70">organic, local and seasonal</p>
            <p className="mt-6 max-w-[42ch] text-ink/70">
              Explore gourmet goods, whole foods, fresh fruit and vegetables, and sweet treats.
              We source from local and interstate growers, choosing organic and biodynamic produce
              and seasonal regional products wherever we can.
            </p>
            <p className="mt-8 max-w-[32ch] border-l border-ember/30 pl-4 font-serif text-2xl italic text-ember">
              Behind every product is a choice about the world we want to support.
            </p>
          </div>
          <div className="relative min-h-[24rem] overflow-hidden md:min-h-[34rem]" data-pan-wrap>
            <Image
              src="/assets/IMG_5756.JPG"
              alt="A café bowl of berries, coconut, orange and lemon"
              fill
              sizes="(min-width: 768px) 38rem, 100vw"
              data-pan
              className="object-cover"
            />
          </div>
        </div>
      </section> */}

      <section aria-labelledby="true-cost-title" className="bg-paper">
        <div className="mx-auto grid max-w-[76rem] gap-8 px-5 py-16 md:grid-cols-2 md:gap-x-16 md:gap-y-10 md:py-24">
          <div>
            <h2 id="true-cost-title" className="font-serif text-5xl leading-tight text-balance text-ember md:text-7xl">
              The true cost
            </h2>
            <p className="mt-5 max-w-xl font-serif text-2xl leading-snug text-pretty md:text-3xl">
              Better choices for the planet, animal welfare and our health can cost a little more.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-pretty text-ink/70">
              That is our ethos: supporting responsible producers and saying no to the industrial food system.
            </p>
          </div>

          <RevealImageMask
            src="/assets/store.jpg"
            alt="Wooden shelves and locally sourced goods inside the Organic Market in Stirling"
            sizes="(min-width: 1216px) 576px, (min-width: 768px) 50vw, 100vw"
            className="aspect-square md:col-start-2 md:row-span-2 md:row-start-1 md:aspect-auto"
          />

          <div className="md:col-start-1">
            <dl className="divide-y divide-line border-y border-line">
              {reasons.map(({ title, text }) => (
                <div key={title} className="grid gap-2 py-5 sm:grid-cols-2 sm:gap-6">
                  <dt className="font-serif text-xl leading-snug text-balance text-ember">{title}</dt>
                  <dd className="text-sm leading-relaxed text-pretty text-ink/70">{text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm leading-relaxed text-pretty text-ink/70">
              <span className="text-ink">From our market to your café table.</span>{" "}
              The same care carries into our café: simple, wholesome food with a vegetarian focus,
              made with seasonal produce.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Enjoy our café" className="bg-paper">
        <div className="mx-auto max-w-[76rem] px-5">
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <PortfolioScrollGrid
              title={<span className="block font-serif font-normal normal-case">Enjoy our café</span>}
              images={[...cafeImages]}
              rows={4}
              className="bg-paper text-ink"
            />
          </div>
        </div>
      </section>

      <section className="garden-section garden-wash">
        <div className="mx-auto max-w-[76rem] px-5 py-16 md:py-24">
          <div className="hills-intro relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-hills-intro>
            {/* <BotanicalArt variant="hills" className="section-heading-art" /> */}
            <div className="max-w-xl">
              <h2 className="font-serif text-4xl tracking-[-0.03em] md:text-6xl">Find us in the Hills</h2>
              <p className="mt-3 font-serif text-2xl italic text-ink/70">come for the market, stay for the café</p>
            </div>
            <Link href="/cafe/menu" className="btn min-h-12 w-full shrink-0 gap-3 sm:w-auto sm:self-start md:self-auto">
              See our menu
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="hills-grid mt-10" data-hills-gallery>
            {gallery.map((photo) => (
              <article key={photo.src} className="hills-tile">
                <div className="hills-photo">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1216px) 294px, (min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="hills-copy">
                  <p className="eyebrow">{photo.label}</p>
                  <h3 className="font-serif text-balance">{photo.title}</h3>
                  <p className="hills-description text-pretty">{photo.text}</p>
                  <Link href={photo.href} className="hills-link">
                    {photo.link}
                    <ArrowUpRight size={18} aria-hidden="true" className="shrink-0" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[76rem] items-start gap-12 px-5 py-16 md:grid-cols-2 md:py-24" data-pair>
          <div>
            <h2 className="font-serif text-4xl tracking-[-0.03em] md:text-6xl">Visit the Organic Market and Café</h2>
            <p className="mt-3 font-serif text-2xl italic text-ink/70">in the heart of Stirling</p>
            <p className="mt-6 text-lg">
              The Organic Market and Café
              <br />
              {address.line1}
              <br />
              {address.line2}
            </p>
            <p className="mt-4">
              <a className="link" href={phoneHref}>
                {phoneDisplay}
              </a>
            </p>
            <div className="mt-6 max-w-md">
              <HoursTable />
            </div>
            <p className="mt-6">
              <a className="btn" href={mapsUrl} target="_blank" rel="noreferrer">
                Get directions
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
          <iframe
            title="Map of 5 Druid Avenue, Stirling"
            src="https://maps.google.com/maps?q=5%20Druid%20Avenue%20Stirling%20SA%205152&z=15&output=embed"
            className="h-80 w-full border border-line md:h-full md:min-h-[28rem]"
            loading="lazy"
          />
        </div>
      </section>
    </HomeScroll>
  );
}

import { Hero } from "@/components/hero";
import { BotanicalArt } from "@/components/botanical-art";
import { HomeScroll } from "@/components/home-scroll";
import { HoursTable } from "@/components/hours-table";
import { PortfolioScrollGrid } from "@/components/ui/portfolio-scroll-grid";
import { address, mapsUrl, phoneDisplay, phoneHref } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

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
  { src: "/assets/store.jpg", alt: "Inside the Organic Market" },
  { src: "/assets/bar.png", alt: "The café bar" },
  { src: "/assets/shop.jpg", alt: "The Organic Market shopfront" },
  { src: "/assets/cfs3.png", alt: "The café space in Stirling" },
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

      <section className="garden-section garden-wash">
        <BotanicalArt className="garden-art garden-art-left" />
        <div
          className="mx-auto grid max-w-[76rem] items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24"
          data-pair
        >
          <div>
            <h2 className="max-w-[12ch] font-serif text-4xl leading-[1.05] tracking-[-0.03em] md:text-6xl">
              A market full of good things
            </h2>
            <p className="mt-3 font-serif text-2xl italic text-ink/70">organic, local and seasonal</p>
            <p className="mt-6 max-w-[42ch] text-ink/70">
              Explore gourmet goods, whole foods, fresh fruit and vegetables, and sweet treats.
              We source from local and interstate growers, choosing organic and biodynamic produce
              and seasonal regional products wherever we can.
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
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[76rem] px-5 ">
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <PortfolioScrollGrid
              title={
                <>
                  <span className="block font-serif font-normal normal-case">Enjoy our café</span>
                </>
              }
              images={[...cafeImages]}
              rows={4}
              className="bg-paper text-ink"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-[76rem] items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="relative min-h-[24rem] md:min-h-[36rem]" data-reveal>
            <Image
              src="/assets/img2.png"
              alt="A breakfast bowl with fruit, nuts and coconut"
              fill
              sizes="(min-width: 768px) 38rem, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif text-4xl tracking-[-0.03em] md:text-6xl" data-reveal>
              The true cost
            </h2>
            <p className="mt-4 max-w-[42ch] text-ink/70">
              Better choices for the planet, animal welfare and our health can cost a little more.
              That is our ethos: supporting responsible producers and saying no to the industrial
              food system.
            </p>
            <ul className="mt-8 divide-y divide-line border-y border-line" data-shelf>
              {reasons.map((reason) => (
                <li key={reason.title} className="py-5">
                  <p className="font-serif text-2xl tracking-[-0.02em]">{reason.title}</p>
                  <p className="mt-2 max-w-[36ch] text-ink/70">{reason.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="garden-section garden-wash">
        <div className="mx-auto max-w-[76rem] px-5 py-16 md:py-24">
          <div className="relative" data-reveal>
            {/* <BotanicalArt variant="hills" className="section-heading-art" /> */}
            <div className="max-w-xl">
              <h2 className="font-serif text-4xl tracking-[-0.03em] md:text-6xl">Find us in the Hills</h2>
              <p className="mt-3 font-serif text-2xl italic text-ink/70">a market and café in Stirling</p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4" data-gallery>
            {gallery.map((photo) => (
              <div key={photo.src} className="relative h-48 md:h-72">
                <Image src={photo.src} alt={photo.alt} fill sizes="25vw" className="object-cover" />
              </div>
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

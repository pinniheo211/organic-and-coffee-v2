import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { BotanicalArt } from "@/components/botanical-art";
import { phoneDisplay, phoneHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Café",
  description:
    "Vegetarian café at the Organic Market in Stirling. Seasonal salads and soups, D'Angelo organic coffee, and room for most dietary requirements.",
};

export default function CafePage() {
  return (
    <article>
      <PageHero title="The café kitchen" image={{ src: "/assets/IMG_5756.JPG", alt: "A café bowl of berries, coconut, orange and lemon" }}>
        Wholesome food and coffee, cooked beside the shop that supplies it. The menu is vegetarian
        first, and it can be vegan, dairy-free, gluten-free or sugar-free.
      </PageHero>

      <section data-pair className="mx-auto grid max-w-5xl gap-8 px-5 py-10 md:grid-cols-2 md:gap-12 md:py-14">
        <div>
          <p className="eyebrow">The menu</p>
          <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em]">What is cooked</h2>
          <p className="mt-4 max-w-[46ch] text-ink/70">
            Salads, soups and a special main are made each day from seasonal produce, organic
            wherever the kitchen can get it. The bench assembles bruschettas, focaccias and
            croissants to order.
          </p>
          <p className="mt-4 max-w-[46ch] text-ink/70">
            Coffee is organic, from D&apos;Angelo, served black or with Paris Creek organic milk or
            a milk substitute. Teas, smoothies, fresh juice, beer and wine sit alongside it.
          </p>
        </div>
        <div>
          <p className="eyebrow">How to order</p>
          <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em]">At the café</h2>
          <ul className="mt-4 max-w-[46ch] space-y-4 text-ink/70">
            <li>
              <span className="font-medium text-ink">At a table.</span> QR codes are on the
              condiment boxes.
            </li>
            <li>
              <span className="font-medium text-ink">From the window.</span> Park beside it and
              toot. The drive-through is there so you can skip the queue.
            </li>
            <li>
              <span className="font-medium text-ink">From the counter.</span> Takeaway is made
              while you wait.
            </li>
          </ul>
        </div>
      </section>

      <section className="garden-section garden-wash">
        <BotanicalArt variant="coffee" className="garden-art garden-art-right" />
        <div data-gallery className="mx-auto grid max-w-5xl gap-3 px-5 pt-10 md:grid-cols-[1.15fr_0.85fr] md:pt-14">
          <div className="relative h-56 overflow-hidden md:h-64">
            <Image
              src="/assets/cfs1.png"
              alt="A painting on the café wall, above the wine shelf"
              fill
              sizes="(min-width: 768px) 38rem, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative h-56 overflow-hidden md:mt-10 md:h-64">
            <Image
              src="/assets/cfs2.png"
              alt="The café wall, with local art and the daily special boards"
              fill
              sizes="(min-width: 768px) 38rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div data-pair className="mx-auto grid max-w-5xl gap-8 px-5 py-10 md:grid-cols-2 md:py-12">
          <p className="max-w-[42ch] text-ink/70">
            The café holds a Green Table Award from Environmental Sustainable Savour, for the way
            the kitchen is run.
          </p>
          <p className="max-w-[42ch] text-ink/70">
            Once a month the room gives space to art, textiles, jewellery and pottery, with no
            commission. Ask for Elle on{" "}
            <a className="link" href={phoneHref}>
              {phoneDisplay}
            </a>
            .
          </p>
        </div>
      </section>

      <div data-reveal className="mx-auto flex max-w-5xl flex-wrap gap-3 px-5 py-10">
        <Link className="btn" href="/cafe/menu">
          See the café menu
        </Link>
        <Link className="btn-line" href="/visit">
          Hours and the address
        </Link>
      </div>
    </article>
  );
}

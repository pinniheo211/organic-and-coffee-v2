import type { Metadata } from "next";
import { HoursTable } from "@/components/hours-table";
import { PageHero } from "@/components/page-hero";
import { ContactLinks } from "@/components/contact-links";
import { address, mapsUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit",
  description:
    "The Organic Market and Café is at 5 Druid Avenue, Stirling, in the Adelaide Hills. Hours, directions and a message for the shop.",
};

export default function VisitPage() {
  return (
    <article>
      <PageHero title="Stirling, at the start of the Hills" image={{ src: "/assets/shop.jpg", alt: "The front of the market at 5 Druid Avenue, under autumn vines", position: "left" }}>
        The shop and café are in the middle of Stirling, with street parking and local free car
        parks. The Hills are a short drive from Adelaide.
      </PageHero>

      <section data-pair className="mx-auto grid max-w-5xl gap-10 px-5 py-10 md:grid-cols-2 md:gap-14 md:py-14">
        <div>
          <p className="eyebrow">Address</p>
          <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em]">Find us</h2>
          <p className="mt-4 text-lg">
            The Organic Market and Café
            <br />
            {address.line1}
            <br />
            {address.line2}
          </p>
          <ContactLinks className="mt-5" />
          <p className="mt-6">
            <a className="btn" href={mapsUrl} target="_blank" rel="noreferrer">
              Get directions
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
        <div>
          <p className="eyebrow">When we are open</p>
          <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em]">Hours</h2>
          <div className="mt-4">
            <HoursTable />
          </div>
        </div>
      </section>
    </article>
  );
}

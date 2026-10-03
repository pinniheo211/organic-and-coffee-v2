import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CafeMenuSectionGrid } from "@/components/cafe-menu-section";
import { CafeMenuNav } from "@/components/cafe-menu-nav";
import { cafeMenu, orderUpMenuUrl } from "@/lib/cafe-menu";

export const metadata: Metadata = {
  title: "Café menu",
  description:
    "Breakfast, lunch, cakes, organic coffee and drinks at The Organic Market and Café in Stirling.",
};

export default function CafeMenuPage() {
  return (
    <article>
      <PageHero title="Café menu" eyebrow="The Organic Market and Café">
        Breakfast, lunch and something from the cabinet, with organic coffee and fresh drinks.
        Made for the table in Stirling.
      </PageHero>

      <div className="mx-auto mt-9 max-w-[76rem] px-5">
        <div className="sticky top-[var(--header-h)] z-40 -mx-5 border-y border-line bg-paper px-5 py-3.5 ">
          <CafeMenuNav sections={cafeMenu} />
        </div>

        <div className="grid gap-12 py-12 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-20 md:py-16">
          <aside data-reveal-group className="h-fit md:sticky md:top-24">
            <div className="relative mb-5 aspect-[4/3] overflow-hidden bg-recess">
              <Image
                src="/assets/cfs3.png"
                alt="The café dining area, with tables beside the Organic Market"
                fill
                sizes="(min-width: 768px) 13rem, 100vw"
                className="object-cover"
              />
            </div>
            <p className="eyebrow">Made in the café</p>
            <p className="mt-3 font-serif text-2xl leading-tight">A vegetarian kitchen, using the season as its guide.</p>
            <p className="mt-4 text-sm leading-relaxed text-ink/65">
              Many dishes can be adapted. Ask our team about ingredients and dietary needs.
            </p>
            <Link href="/cafe" className="link mt-5 inline-block text-sm">
              About the café
            </Link>
          </aside>
  
          <div className="min-w-0">
            {cafeMenu.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
              className="scroll-mt-16 border-t border-line py-8 first:border-t-0 first:pt-0 md:py-10"
              >
                <div data-pair className="mb-5 grid items-center gap-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-6">
                  <div className="relative aspect-[4/3] overflow-hidden bg-recess">
                    <Image
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      fill
                      sizes="(min-width: 640px) 8.5rem, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 id={`${section.id}-title`} className="font-serif text-3xl tracking-[-0.025em] md:text-4xl">
                      {section.title}
                    </h2>
                    {section.note ? <p className="text-sm text-ink/55">{section.note}</p> : null}
                  </div>
                </div>
              <CafeMenuSectionGrid section={section} />
              </section>
            ))}
  
            <p data-reveal className="border-t border-line pt-5 text-sm leading-relaxed text-ink/60">
              Prices and availability can change; the cake cabinet and seasonal dishes vary. For the
              current selection, dietary questions or takeaway orders, check the live menu or ask us
              at the café.
            </p>
            <div data-reveal className="mt-6 flex flex-wrap gap-3">
              <a className="btn" href={orderUpMenuUrl} target="_blank" rel="noreferrer">
                Order from the café
              </a>
              <Link className="btn-line" href="/shop">
                Shop online
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

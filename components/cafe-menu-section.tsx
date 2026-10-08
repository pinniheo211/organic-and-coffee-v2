import type { CafeMenuSection } from "@/lib/cafe-menu";
import { formatPrice } from "@/lib/catalog";
import Image from "next/image";

const priceInCents = (price: string) => Math.round(Number(price.replace(/^from\s+/i, "")) * 100);

export function CafeMenuSectionGrid({ section }: { section: CafeMenuSection }) {
  return (
    <ul className="grid gap-x-7 sm:grid-cols-2 xl:grid-cols-3">
      {section.items.map((item) => (
        <li key={item.name} className="flex min-w-0 flex-col border-t border-line py-4">
          <div className="relative mb-3 aspect-[4/3] overflow-hidden bg-sage">
            <Image
              src={section.imageSrc}
              alt=""
              fill
              sizes="(min-width: 1280px) 25rem, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-xl leading-tight tracking-[-0.02em]">{item.name}</h3>
            <p className="shrink-0 text-sm tabular-nums text-ink/75">
              {item.price.startsWith("from ") ? "From " : ""}{formatPrice(priceInCents(item.price))}
            </p>
          </div>
          {item.description ? (
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.description}</p>
          ) : null}
          {item.dietary?.length ? (
            <p className="mt-auto pt-3 text-[0.68rem] tracking-[0.08em] text-ember/90">
              {item.dietary.join(" · ")}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

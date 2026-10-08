"use client";

import { useCart } from "@/components/cart-provider";
import { formatPrice, getProduct } from "@/lib/catalog";
import { Leaf, ShoppingBasket, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type BasketRow = {
  slug: string;
  qty: number;
  kind: "shop" | "cafe";
  product: {
    name: string;
    price: number;
    unit: string;
    image?: string;
    imageFit?: "cover" | "contain";
  };
  details: string[];
  note: string;
};

export function BasketView() {
  const { ready, lines, setQty, remove } = useCart();

  if (!ready) return <p className="text-ink/50">Loading the basket.</p>;

  const rows = lines.reduce<BasketRow[]>((rows, line) => {
    if ("kind" in line && line.kind === "cafe") {
      rows.push({
        ...line,
        product: {
          name: line.name,
          price: line.price,
          unit: "serving",
          image: line.image,
        },
      });
      return rows;
    }
    const product = getProduct(line.slug);
    if (product) rows.push({ ...line, kind: "shop", product, details: [], note: "" });
    return rows;
  }, []);

  if (rows.length === 0) {
    return (
      <div className="grid gap-5 bg-sage p-7 sm:p-10">
        {/* <ShoppingBasket size={34} strokeWidth={1.4} className="text-forest" aria-hidden="true" /> */}
        <div>
          <p className="font-serif text-3xl tracking-[-0.03em]">Your basket is empty</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/65">
            Find something good for your kitchen from the market shelves.
          </p>
        </div>
        <Link className="btn w-fit" href="/shop">
          Browse the shop
        </Link>
      </div>
    );
  }

  const total = rows.reduce((sum, row) => sum + row.product.price * row.qty, 0);
  const itemCount = rows.reduce((sum, row) => sum + row.qty, 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-12">
      <section aria-label="Basket items">
        <ul className="divide-y divide-line border-y border-line">
          {rows.map((row) => (
            <li
              key={row.slug}
              className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-4 py-5 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center sm:gap-x-5 sm:py-6"
            >
              <div className="relative size-20 overflow-hidden bg-sage sm:size-24">
                {row.product.image ? (
                  <Image
                    src={row.product.image}
                    alt=""
                    fill
                    sizes="96px"
                    className={
                      row.product.imageFit === "contain"
                        ? "object-contain p-3 mix-blend-multiply"
                        : "object-cover"
                    }
                  />
                ) : (
                  <span className="grid size-full place-items-center text-forest" aria-hidden="true">
                    <Leaf size={24} strokeWidth={1.4} />
                  </span>
                )}
              </div>

              <div className="min-w-0 self-center">
                {row.kind === "cafe" ? (
                  <p className="font-serif text-xl leading-tight tracking-[-0.03em] sm:text-2xl">
                    {row.product.name}
                  </p>
                ) : (
                  <Link
                    href={`/shop/${row.slug}`}
                    className="font-serif text-xl leading-tight tracking-[-0.03em] hover:text-forest sm:text-2xl"
                  >
                    {row.product.name}
                  </Link>
                )}
                <p className="mt-1 text-sm text-ink/55">
                  {formatPrice(row.product.price)} · {row.product.unit}
                </p>
                {row.details.length ? (
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">{row.details.join(" · ")}</p>
                ) : null}
                {row.note ? <p className="mt-1 text-sm text-ink/60">Kitchen note: {row.note}</p> : null}
              </div>

              <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:justify-end sm:gap-4">
                <div className="flex items-center border border-line bg-paper" role="group" aria-label={`Quantity for ${row.product.name}`}>
                  <button
                    type="button"
                    className="grid size-10 place-items-center"
                    aria-label={`Decrease ${row.product.name}`}
                    onClick={() => setQty(row.slug, row.qty - 1)}
                  >
                    −
                  </button>
                  <span className="w-8 text-center tabular-nums">{row.qty}</span>
                  <button
                    type="button"
                    className="grid size-10 place-items-center"
                    aria-label={`Increase ${row.product.name}`}
                    onClick={() => setQty(row.slug, row.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <p className="font-medium tabular-nums">{formatPrice(row.product.price * row.qty)}</p>
                <button
                  type="button"
                  className="grid size-10 shrink-0 place-items-center text-ink/60 transition-colors hover:text-ember"
                  aria-label={`Remove ${row.product.name} from basket`}
                  title={`Remove ${row.product.name} from basket`}
                  onClick={() => remove(row.slug)}
                >
                  <Trash2 size={18} strokeWidth={1.7} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="basket-summary h-fit p-6 sm:p-7 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
        <h2 className="font-serif text-2xl tracking-[-0.03em]">Order summary</h2>
        <div className="mt-6 flex items-center justify-between border-b border-paper/20 pb-4 text-sm text-paper/75">
          <span>Items</span>
          <span className="tabular-nums">{itemCount}</span>
        </div>
        <div className="pt-5">
          <p className="text-sm text-paper/70">Total</p>
          <p className="mt-1 font-serif text-4xl tracking-[-0.03em] tabular-nums">{formatPrice(total)}</p>
        </div>
        <Link className="btn basket-summary-action mt-7 w-full" href="/shop/checkout">
          Checkout
        </Link>
        <Link href="/shop" className="mt-4 block text-center text-sm text-paper/80 underline underline-offset-4 hover:text-paper">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}

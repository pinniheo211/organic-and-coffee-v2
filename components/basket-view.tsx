"use client";

import { useCart } from "@/components/cart-provider";
import { formatPrice, getProduct } from "@/lib/catalog";
import Link from "next/link";

export function BasketView() {
  const { ready, lines, setQty, remove } = useCart();

  if (!ready) return <p className="text-ink/50">Loading the basket.</p>;

  const rows = lines.flatMap((line) => {
    const product = getProduct(line.slug);
    return product ? [{ ...line, product }] : [];
  });

  if (rows.length === 0) {
    return (
      <div>
        <p className="text-ink/70">Your basket is empty.</p>
        <p className="mt-6">
          <Link className="btn" href="/shop">
            Browse the shop
          </Link>
        </p>
      </div>
    );
  }

  const total = rows.reduce((sum, row) => sum + row.product.price * row.qty, 0);

  return (
    <div>
      <ul className="divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <li key={row.slug} className="grid gap-4 py-6 md:grid-cols-[1fr_auto_auto] md:items-center">
            <div>
              <Link href={`/shop/${row.slug}`} className="font-serif text-2xl tracking-[-0.03em]">
                {row.product.name}
              </Link>
              <p className="mt-1 text-ink/55">
                {formatPrice(row.product.price)} · {row.product.unit}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-line">
                <button
                  type="button"
                  className="grid size-10 place-items-center"
                  aria-label={`Decrease ${row.product.name}`}
                  onClick={() => setQty(row.slug, row.qty - 1)}
                >
                  −
                </button>
                <span className="w-8 text-center">{row.qty}</span>
                <button
                  type="button"
                  className="grid size-10 place-items-center"
                  aria-label={`Increase ${row.product.name}`}
                  onClick={() => setQty(row.slug, row.qty + 1)}
                >
                  +
                </button>
              </div>
              <button type="button" className="link" onClick={() => remove(row.slug)}>
                Remove
              </button>
            </div>
            <p className="md:text-right">{formatPrice(row.product.price * row.qty)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
        <p className="font-serif text-3xl tracking-[-0.03em]">{formatPrice(total)}</p>
        <Link className="btn" href="/shop/checkout">
          Checkout
        </Link>
      </div>
    </div>
  );
}

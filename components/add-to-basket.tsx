"use client";

import { useCart } from "@/components/cart-provider";
import Link from "next/link";
import { useState } from "react";

export function AddToBasket({ slug }: { slug: string }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-line">
          <button
            type="button"
            className="grid size-11 place-items-center"
            aria-label="Decrease quantity"
            onClick={() => setQty((current) => Math.max(1, current - 1))}
          >
            −
          </button>
          <span className="w-8 text-center">{qty}</span>
          <button
            type="button"
            className="grid size-11 place-items-center"
            aria-label="Increase quantity"
            onClick={() => setQty((current) => current + 1)}
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            add(slug, qty);
            setAdded(true);
          }}
        >
          Add to basket
        </button>
      </div>
      {added ? (
        <p className="mt-4">
          <Link className="link" href="/shop/basket">
            View basket
          </Link>
        </p>
      ) : null}
    </div>
  );
}

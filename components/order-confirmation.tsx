"use client";

import { orderStorageKey, type PlacedOrder } from "@/components/checkout-form";
import { formatPrice } from "@/lib/catalog";
import Link from "next/link";
import { useEffect, useState } from "react";

export function OrderConfirmation() {
  const [order, setOrder] = useState<PlacedOrder | null | undefined>(undefined);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(orderStorageKey);
    if (!saved) {
      setOrder(null);
      return;
    }
    try {
      setOrder(JSON.parse(saved) as PlacedOrder);
    } catch {
      setOrder(null);
    }
  }, []);

  if (order === undefined) return <p className="text-ink/50">Loading the order.</p>;

  if (!order) {
    return (
      <div>
        <p className="text-ink/70">There is no order on this browser.</p>
        <p className="mt-6">
          <Link className="btn" href="/shop">
            Back to the shop
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <p className="text-ink/60">Reference {order.id}. The shop has not received this preview order.</p>
      <h2 className="mt-6 font-serif text-3xl tracking-[-0.03em]">{order.name}</h2>
      <p className="mt-2 text-ink/70">
        {order.email}
        <br />
        {order.phone}
      </p>
      <p className="mt-4 text-ink/70">
        {order.fulfilment === "collect" ? "Click and collect" : "Home delivery"}
        <br />
        {order.street}
      </p>
      {order.note ? <p className="mt-4 text-ink/70">{order.note}</p> : null}
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {order.lines.map((line) => (
          <li key={line.name} className="flex justify-between gap-4 py-3">
            <span>
              {line.name}
              <span className="text-ink/50"> × {line.qty}</span>
            </span>
            <span>{formatPrice(line.price * line.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-serif text-3xl">{formatPrice(order.total)}</p>
      <p className="mt-8">
        <Link className="link" href="/shop">
          Continue shopping
        </Link>
      </p>
    </div>
  );
}

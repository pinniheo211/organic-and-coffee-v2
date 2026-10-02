"use client";

import { useCart } from "@/components/cart-provider";
import { formatPrice, getProduct } from "@/lib/catalog";
import { address } from "@/lib/site";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";

export const orderStorageKey = "organic-market-order";

export type PlacedOrder = {
  id: string;
  name: string;
  email: string;
  phone: string;
  fulfilment: "collect" | "delivery";
  street: string;
  note: string;
  lines: { name: string; qty: number; price: number }[];
  total: number;
};

export function CheckoutForm() {
  const base = useId();
  const router = useRouter();
  const { ready, lines, clear } = useCart();
  const [fulfilment, setFulfilment] = useState<"collect" | "delivery">("collect");

  const rows = lines.flatMap((line) => {
    const product = getProduct(line.slug);
    return product ? [{ name: product.name, qty: line.qty, price: product.price }] : [];
  });
  const total = rows.reduce((sum, row) => sum + row.price * row.qty, 0);

  if (!ready) return <p className="text-ink/50">Loading the basket.</p>;

  if (rows.length === 0) {
    return <p className="text-ink/70">Add something from the shop before checkout.</p>;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const order: PlacedOrder = {
      id: `OM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      fulfilment,
      street: fulfilment === "delivery" ? String(data.get("street") ?? "") : address.full,
      note: String(data.get("note") ?? ""),
      lines: rows,
      total,
    };
    window.sessionStorage.setItem(orderStorageKey, JSON.stringify(order));
    clear();
    router.push("/shop/confirmed");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-5">
        <p className="text-ink/60">
          This is a preview. Nothing is charged, and the shop is not notified.
        </p>
        <Field id={`${base}-name`} label="Name" name="name" autoComplete="name" required />
        <Field id={`${base}-email`} label="Email" name="email" type="email" autoComplete="email" required />
        <Field id={`${base}-phone`} label="Phone" name="phone" type="tel" autoComplete="tel" required />
        <fieldset>
          <legend className="text-[0.95rem]">How to receive it</legend>
          <label className="mt-3 flex items-start gap-3">
            <input
              type="radio"
              name="fulfilment"
              value="collect"
              checked={fulfilment === "collect"}
              onChange={() => setFulfilment("collect")}
            />
            <span>Click and collect at {address.full}</span>
          </label>
          <label className="mt-2 flex items-start gap-3">
            <input
              type="radio"
              name="fulfilment"
              value="delivery"
              checked={fulfilment === "delivery"}
              onChange={() => setFulfilment("delivery")}
            />
            <span>Home delivery</span>
          </label>
        </fieldset>
        {fulfilment === "delivery" ? (
          <Field id={`${base}-street`} label="Delivery address" name="street" autoComplete="street-address" required />
        ) : null}
        <label className="block" htmlFor={`${base}-note`}>
          Note for the shop
          <textarea id={`${base}-note`} name="note" className="input min-h-28" />
        </label>
        <button type="submit" className="btn w-fit">
          Place order
        </button>
      </div>
      <aside className="h-fit border border-line bg-white p-6">
        <h2 className="font-serif text-2xl tracking-[-0.03em]">Basket</h2>
        <ul className="mt-4 divide-y divide-line">
          {rows.map((row) => (
            <li key={row.name} className="flex justify-between gap-4 py-3">
              <span>
                {row.name}
                <span className="text-ink/50"> × {row.qty}</span>
              </span>
              <span>{formatPrice(row.price * row.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between font-serif text-2xl">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </p>
      </aside>
    </form>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block" htmlFor={id}>
      {label}
      <input id={id} name={name} type={type} autoComplete={autoComplete} required={required} className="input" />
    </label>
  );
}

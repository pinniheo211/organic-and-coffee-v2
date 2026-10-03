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
  lines: { name: string; qty: number; price: number; details?: string[]; note?: string; kind?: "shop" | "cafe" }[];
  total: number;
};

export function CheckoutForm() {
  const base = useId();
  const router = useRouter();
  const { ready, lines, clear } = useCart();
  const [fulfilment, setFulfilment] = useState<"collect" | "delivery">("collect");

  const rows = lines.reduce<PlacedOrder["lines"]>((rows, line) => {
    if ("kind" in line && line.kind === "cafe") {
      rows.push({ name: line.name, qty: line.qty, price: line.price, details: line.details, note: line.note, kind: "cafe" });
      return rows;
    }
    const product = getProduct(line.slug);
    if (product) rows.push({ name: product.name, qty: line.qty, price: product.price, details: [], note: "", kind: "shop" });
    return rows;
  }, []);
  const hasCafeItems = rows.some((row) => row.kind === "cafe");
  const activeFulfilment = hasCafeItems ? "collect" : fulfilment;
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
      fulfilment: activeFulfilment,
      street: activeFulfilment === "delivery" ? String(data.get("street") ?? "") : address.full,
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
          This is a preview. Nothing is charged, and no order is sent to the shop or café.
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
              checked={activeFulfilment === "collect"}
              onChange={() => setFulfilment("collect")}
            />
            <span>Click and collect at {address.full}</span>
          </label>
          <label className="mt-2 flex items-start gap-3">
            <input
              type="radio"
              name="fulfilment"
              value="delivery"
              checked={activeFulfilment === "delivery"}
              onChange={() => setFulfilment("delivery")}
              disabled={hasCafeItems}
            />
            <span className={hasCafeItems ? "text-ink/45" : undefined}>
              Home delivery{hasCafeItems ? " · café items must be collected" : ""}
            </span>
          </label>
        </fieldset>
        {activeFulfilment === "delivery" ? (
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
              {rows.map((row, index) => (
                <li key={`${row.kind}-${row.name}-${index}`} className="flex justify-between gap-4 py-3">
                  <span>
                    {row.name}
                    <span className="text-ink/50"> × {row.qty}</span>
                    {row.details?.length ? <span className="mt-1 block text-sm text-ink/55">{row.details.join(" · ")}</span> : null}
                    {row.note ? <span className="mt-1 block text-sm text-ink/55">Kitchen note: {row.note}</span> : null}
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

"use client";

import { useCart } from "@/components/cart-provider";
import type { CafeMenuItem, CafeMenuSection } from "@/lib/cafe-menu";
import { formatPrice } from "@/lib/catalog";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type Choice = { id: string; label: string; price: number };
type ItemOptions = { addOns: Choice[]; glutenFree: Choice };

const optionsBySection: Record<string, ItemOptions> = {
  breakfast: {
    addOns: [
      { id: "avocado", label: "Extra avocado", price: 400 },
      { id: "haloumi", label: "Haloumi", price: 450 },
      { id: "sourdough", label: "Side of sourdough", price: 250 },
    ],
    glutenFree: { id: "gluten-free", label: "Gluten-free bread", price: 250 },
  },
  lunch: {
    addOns: [
      { id: "avocado", label: "Extra avocado", price: 400 },
      { id: "haloumi", label: "Haloumi", price: 450 },
      { id: "side-salad", label: "Side salad", price: 600 },
    ],
    glutenFree: { id: "gluten-free", label: "Gluten-free bread", price: 250 },
  },
  cakes: {
    addOns: [
      { id: "cream", label: "Cream", price: 150 },
      { id: "ice-cream", label: "Ice cream", price: 250 },
      { id: "berry-compote", label: "Berry compote", price: 200 },
    ],
    glutenFree: { id: "gluten-free", label: "Gluten-free cabinet option", price: 0 },
  },
  coffee: {
    addOns: [
      { id: "extra-shot", label: "Extra espresso shot", price: 100 },
      { id: "oat-milk", label: "Oat milk", price: 80 },
      { id: "soy-milk", label: "Soy milk", price: 80 },
    ],
    glutenFree: { id: "gluten-free", label: "Gluten-free preparation request", price: 0 },
  },
  smoothies: {
    addOns: [
      { id: "protein", label: "Plant protein", price: 200 },
      { id: "nut-butter", label: "Nut butter", price: 150 },
      { id: "banana", label: "Extra banana", price: 100 },
    ],
    glutenFree: { id: "gluten-free", label: "Gluten-free preparation request", price: 0 },
  },
  "cold-drinks": {
    addOns: [
      { id: "ginger", label: "Fresh ginger", price: 80 },
      { id: "mint", label: "Fresh mint", price: 80 },
      { id: "sparkling", label: "Sparkling", price: 150 },
    ],
    glutenFree: { id: "gluten-free", label: "Gluten-free preparation request", price: 0 },
  },
};

const priceInCents = (price: string) => Math.round(Number(price.replace(/^from\s+/i, "")) * 100);

function makeLineId(sectionId: string, itemName: string, selections: string[]) {
  const base = `${sectionId}-${itemName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const value = selections.slice().sort().join("|");
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
  }
  return `cafe-${base}-${(hash >>> 0).toString(36)}`;
}

export function CafeMenuSectionGrid({ section }: { section: CafeMenuSection }) {
  const { addCafe } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<CafeMenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [glutenFree, setGlutenFree] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [addedName, setAddedName] = useState<string | null>(null);
  const options = optionsBySection[section.id] ?? optionsBySection.lunch;

  useEffect(() => {
    if (selected && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [selected]);

  const chosenAddOns = useMemo(
    () => options.addOns.filter((option) => selectedAddOns.includes(option.id)),
    [options.addOns, selectedAddOns],
  );
  const basePrice = selected ? priceInCents(selected.price) : 0;
  const unitPrice = basePrice + chosenAddOns.reduce((sum, option) => sum + option.price, 0) + (glutenFree ? options.glutenFree.price : 0);
  const total = unitPrice * quantity;

  function openItem(item: CafeMenuItem) {
    setSelected(item);
    setQuantity(1);
    setSelectedAddOns([]);
    setGlutenFree(false);
    setInstructions("");
    setAddedName(null);
  }

  function closeDialog() {
    dialogRef.current?.close();
    setSelected(null);
  }

  function addSelected() {
    if (!selected) return;
    const labels = [
      ...chosenAddOns.map((option) => `${option.label} (+${formatPrice(option.price)})`),
      ...(glutenFree ? [`${options.glutenFree.label}${options.glutenFree.price ? ` (+${formatPrice(options.glutenFree.price)})` : ""}`] : []),
    ];
    const note = instructions.trim();
    addCafe({
      slug: makeLineId(section.id, selected.name, [...selectedAddOns, ...(glutenFree ? [options.glutenFree.id] : []), note]),
      qty: quantity,
      name: selected.name,
      price: unitPrice,
      image: section.imageSrc,
      details: labels,
      note,
    });
    setAddedName(selected.name);
    closeDialog();
  }

  return (
    <>
      {addedName ? (
        <p className="mb-4 text-sm text-forest" role="status" aria-live="polite">
          {addedName} added to your basket. <Link className="link" href="/shop/basket">View basket</Link>
        </p>
      ) : null}
      <ul data-reveal-group className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {section.items.map((item) => (
          <li key={item.name} className="flex">
            <button
              type="button"
              className="group flex min-h-56 w-full cursor-pointer flex-col border border-line bg-white/50 p-4 text-left transition-colors hover:border-ember/45 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember sm:p-5"
              aria-haspopup="dialog"
              onClick={() => openItem(item)}
            >
              <span className="font-serif text-xl leading-tight group-hover:text-ember">{item.name}</span>
              <span className="mt-2 text-sm font-medium tabular-nums">
                {item.price.startsWith("from ") ? "From " : ""}{formatPrice(priceInCents(item.price))}
              </span>
              {item.description ? <span className="mt-3 text-sm leading-relaxed text-ink/65">{item.description}</span> : null}
              {item.dietary?.length ? <span className="mt-auto flex flex-wrap gap-x-2 pt-4 text-[0.68rem] text-ember/90">{item.dietary.join(" · ")}</span> : null}
            </button>
          </li>
        ))}
      </ul>

      {selected ? (
        <dialog
          ref={dialogRef}
          className="product-dialog fixed inset-0 m-0 grid h-dvh max-h-none w-screen max-w-none place-items-center overflow-y-auto bg-transparent p-3 sm:p-5"
          aria-labelledby="cafe-item-dialog-title"
          onCancel={() => setSelected(null)}
          onClose={() => setSelected(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <article className="product-modal-panel relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[38rem] flex-col overflow-hidden bg-paper shadow-2xl sm:max-h-[calc(100dvh-2.5rem)]">
            <button type="button" className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-paper text-ink shadow cursor-pointer" aria-label="Close item options" onClick={closeDialog}>
              <X size={20} aria-hidden="true" />
            </button>
            <div className="relative h-48 shrink-0 bg-recess sm:h-56">
              <Image src={section.imageSrc} alt={section.imageAlt} fill sizes="(min-width: 640px) 38rem, 100vw" className="object-cover" />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-white px-5 pb-4 pt-4 sm:px-6">
              <h2 id="cafe-item-dialog-title" className="font-sans text-xl font-semibold text-ink">{selected.name}</h2>
              {selected.description ? <p className="mt-2 text-sm leading-relaxed text-ink/65">{selected.description}</p> : null}
              <p className="mt-2 text-sm font-medium tabular-nums">{selected.price.startsWith("from ") ? "From " : ""}{formatPrice(basePrice)}</p>

              <Disclosure title="Add Ons">
                <div className="grid gap-3">
                  {options.addOns.map((option) => (
                    <label key={option.id} className="flex cursor-pointer items-center justify-between gap-4 text-sm">
                      <span className="flex items-center gap-3">
                        <input type="checkbox" checked={selectedAddOns.includes(option.id)} onChange={(event) => setSelectedAddOns((current) => event.target.checked ? [...current, option.id] : current.filter((id) => id !== option.id))} />
                        {option.label}
                      </span>
                      <span className="shrink-0 tabular-nums">+{formatPrice(option.price)}</span>
                    </label>
                  ))}
                </div>
              </Disclosure>

              <Disclosure title="Gluten Free Option">
                <label className="flex cursor-pointer items-start justify-between gap-4 text-sm">
                  <span className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" checked={glutenFree} onChange={(event) => setGlutenFree(event.target.checked)} />
                    <span>{options.glutenFree.label}<span className="mt-1 block text-xs text-ink/55">Sample option — please confirm availability with the café.</span></span>
                  </span>
                  {options.glutenFree.price ? <span className="shrink-0 tabular-nums">+{formatPrice(options.glutenFree.price)}</span> : null}
                </label>
              </Disclosure>

              <Disclosure title="Special Instructions" defaultOpen>
                <label className="block text-sm text-ink/65" htmlFor="cafe-item-instructions">Leave a note for the kitchen</label>
                <textarea id="cafe-item-instructions" className="input mt-2 min-h-20 resize-y rounded-2xl border-line bg-paper" value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="Allergies or special requests" />
              </Disclosure>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-white px-4 py-3 sm:px-5">
              <div className="flex items-center gap-3" role="group" aria-label={`Quantity for ${selected.name}`}>
                <button type="button" className="grid size-11 place-items-center rounded-xl bg-recess enabled:cursor-pointer disabled:opacity-40" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus size={18} aria-hidden="true" /></button>
                <output className="w-4 text-center tabular-nums" aria-live="polite">{quantity}</output>
                <button type="button" className="grid size-11 place-items-center rounded-xl bg-recess cursor-pointer" aria-label="Increase quantity" onClick={() => setQuantity((current) => current + 1)}><Plus size={18} aria-hidden="true" /></button>
              </div>
              <button type="button" className="btn min-w-40 cursor-pointer justify-between gap-5 px-5" onClick={addSelected}>
                <span>Add</span><span className="tabular-nums">{formatPrice(total)}</span>
              </button>
            </div>
          </article>
        </dialog>
      ) : null}
    </>
  );
}

function Disclosure({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `disclosure-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section className="border-b border-line">
      <h3>
        <button type="button" className="flex min-h-12 w-full items-center justify-between gap-4 py-3 text-left font-medium" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((current) => !current)}>
          {title}
          {open ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
        </button>
      </h3>
      {open ? <div id={panelId} className="pb-4">{children}</div> : null}
    </section>
  );
}

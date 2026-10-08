"use client";

import { useCart } from "@/components/cart-provider";
import { categories, formatPrice, type Category, type Product } from "@/lib/catalog";
import { Leaf, Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const sortOptions = [
  { id: "featured", label: "Our selection" },
  { id: "price-low", label: "Price: low to high" },
  { id: "price-high", label: "Price: high to low" },
  { id: "name", label: "Name: A–Z" },
] as const;

type SortOrder = (typeof sortOptions)[number]["id"];

export function ShopCatalog({ products }: { products: Product[] }) {
  const { add } = useCart();
  const [category, setCategory] = useState<Category | "All">("All");
  const [sort, setSort] = useState<SortOrder>("featured");
  const [selected, setSelected] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selected && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [selected]);

  const visible = useMemo(() => {
    const filtered = products.filter((product) => category === "All" || product.category === category);
    const sorted = [...filtered];

    if (sort === "price-low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-high") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [category, products, sort]);

  function openProduct(product: Product) {
    setSelected(product);
    setQuantity(1);
    setAdded(false);
  }

  function closeProduct() {
    dialogRef.current?.close();
    setSelected(null);
  }

  function addSelected() {
    if (!selected) return;
    add(selected.slug, quantity);
    setAdded(true);
  }

  return (
    <div className="mx-auto max-w-[80rem] px-4 pb-16 sm:px-5 sm:pb-20">
      <div className="grid min-w-0 gap-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10">
        <aside className="sticky top-[calc(var(--header-h)-1rem)] z-40 -mx-4 h-fit min-w-0 border-0 bg-paper p-3 shadow-sm sm:-mx-5 sm:top-[calc(var(--header-h)-0.5rem)] md:top-[calc(var(--header-h)+1.5rem)] md:mx-0 md:border md:border-line md:bg-sage md:shadow-none">
          <p className="eyebrow px-3 py-2">Categories</p>
          <nav
            id="shop-category-list"
            aria-label="Shop categories"
            className="-mx-1 flex min-w-0 flex-wrap gap-2 px-1 pb-1 md:mx-0 md:flex-col md:flex-nowrap md:px-0 md:pb-0"
          >
            {(["All", ...categories] as const).map((item) => {
              const active = item === category;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(item)}
                  className={`shrink-0 whitespace-nowrap px-3 py-2.5 text-left text-sm transition-colors ${
                    active ? "shop-filter-active" : "text-ink/75 hover:bg-paper hover:text-forest"
                  }`}
                >
                  {item === "All" ? "All products" : item}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="flex min-w-0 flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">From the Market shelves</p>
              <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em] md:text-4xl">
                {category === "All" ? "All products" : category}
              </h2>
            </div>
            {/* <div className="shop-sort-controls flex min-w-0 max-w-full items-center gap-2 overflow-x-auto pb-1" role="group" aria-label="Sort products">
              <span className="eyebrow mr-1 shrink-0">Sort by</span>
              {sortOptions.map((option) => {
                const active = sort === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSort(option.id)}
                    className={`shrink-0 whitespace-nowrap border px-3 py-2 text-xs transition-colors ${
                      active
                        ? "shop-filter-active"
                        : "border-line text-ink/75 hover:border-forest hover:text-forest"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div> */}
          </div>

          {visible.length === 0 ? (
            <p className="py-16 text-ink/60">No products in this category yet.</p>
          ) : (
            <ul data-reveal className="grid gap-x-4 gap-y-8 pt-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 sm:pt-6 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((product) => (
                <li key={product.slug} className="min-w-0">
                  <button
                    type="button"
                    className="group block h-full w-full cursor-pointer text-left"
                    aria-label={`View details for ${product.name}`}
                    aria-haspopup="dialog"
                    onClick={() => openProduct(product)}
                  >
                    <span className="relative block aspect-[4/3] overflow-hidden bg-sage">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="(min-width: 1280px) 17rem, (min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw"
                          className={`${product.imageFit === "contain" ? "object-contain p-6 mix-blend-multiply" : "object-cover"} transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none`}
                        />
                      ) : (
                        <span className="grid h-full place-content-center justify-items-center gap-3 bg-sage px-4 text-center text-forest">
                          <Leaf size={30} strokeWidth={1.2} aria-hidden="true" />
                          <span className="eyebrow">{product.category}</span>
                        </span>
                      )}
                    </span>
                    <span className="mt-3 flex items-baseline justify-between gap-3">
                      <span className="font-serif text-xl leading-tight tracking-[-0.02em] group-hover:text-forest">
                        {product.name}
                      </span>
                      <span className="shrink-0 text-sm tabular-nums text-ink/75">{formatPrice(product.price)}</span>
                    </span>
                    <span className="mt-1 block text-xs text-ink/55">{product.unit}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-ink/65">{product.summary}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selected ? (
        <dialog
          ref={dialogRef}
          className="product-dialog fixed inset-0 m-0 flex h-dvh max-h-none w-screen max-w-none items-start justify-center overflow-y-auto bg-transparent p-4"
          aria-labelledby={`product-dialog-title-${selected.slug}`}
          onCancel={() => setSelected(null)}
          onClose={() => setSelected(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeProduct();
          }}
        >
          <article className="product-modal-panel relative my-auto grid max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-x-hidden overflow-y-auto bg-paper shadow-2xl md:grid-cols-2">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-paper/90"
              aria-label="Close product details"
              onClick={closeProduct}
            >
              <X size={20} aria-hidden="true" />
            </button>
            <div className="relative min-h-64 bg-sage md:min-h-[30rem]">
              {selected.image ? (
                <Image
                  src={selected.image}
                  alt={selected.name}
                  fill
                  sizes="(min-width: 768px) 24rem, 100vw"
                  className={selected.imageFit === "contain" ? "object-contain p-8 mix-blend-multiply" : "object-cover"}
                />
              ) : (
                <div className="grid h-full min-h-64 place-content-center justify-items-center gap-3 text-forest">
                  <Leaf size={36} strokeWidth={1.2} aria-hidden="true" />
                  <span className="eyebrow">{selected.category}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              <p className="eyebrow">{selected.category}</p>
              <h2 id={`product-dialog-title-${selected.slug}`} className="mt-3 font-serif text-3xl tracking-[-0.03em]">
                {selected.name}
              </h2>
              <p className="mt-3 text-ink/60">{formatPrice(selected.price)} · {selected.unit}</p>
              <p className="mt-5 text-ink/75">{selected.summary}</p>

              <div className="mt-7 flex items-center justify-between border-y border-line py-4">
                <span className="text-sm">Quantity</span>
                <div className="flex items-center border border-line" role="group" aria-label={`Quantity for ${selected.name}`}>
                  <button
                    type="button"
                    className="grid size-11 place-items-center disabled:opacity-40"
                    aria-label={`Decrease quantity of ${selected.name}`}
                    disabled={quantity <= 1 || added}
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  >
                    <Minus size={16} aria-hidden="true" />
                  </button>
                  <output className="w-10 text-center tabular-nums" aria-live="polite">{quantity}</output>
                  <button
                    type="button"
                    className="grid size-11 place-items-center disabled:opacity-40"
                    aria-label={`Increase quantity of ${selected.name}`}
                    disabled={added}
                    onClick={() => setQuantity((current) => current + 1)}
                  >
                    <Plus size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <p className="mt-3 flex justify-between text-sm">
                <span className="text-ink/60">Subtotal</span>
                <span className="font-medium tabular-nums">{formatPrice(selected.price * quantity)}</span>
              </p>
              <button type="button" className="btn mt-5 w-full disabled:opacity-50" onClick={addSelected} disabled={added}>
                {added ? "Added to basket" : `Add ${quantity} to basket`}
              </button>
              {added ? (
                <p className="mt-4 text-center" role="status" aria-live="polite">
                  <Link className="link" href="/shop/basket">View basket</Link>
                </p>
              ) : null}
            </div>
          </article>
        </dialog>
      ) : null}
    </div>
  );
}

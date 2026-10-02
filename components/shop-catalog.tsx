"use client";

import { useCart } from "@/components/cart-provider";
import { categories, formatPrice, type Category, type Product } from "@/lib/catalog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export function ShopCatalog({ products }: { products: Product[] }) {
  const { add } = useCart();
  const [category, setCategory] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selected && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, [selected]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const inCategory = category === "All" || product.category === category;
      const inSearch =
        needle.length === 0 ||
        product.name.toLowerCase().includes(needle) ||
        product.category.toLowerCase().includes(needle);
      return inCategory && inSearch;
    });
  }, [category, products, query]);

  function addOne(slug: string) {
    add(slug, 1);
    setAdded(slug);
  }

  return (
    <div className="mx-auto max-w-[76rem] px-5 pb-20">
      <div data-reveal className="flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-2" role="tablist" aria-label="Departments">
          {(["All", ...categories] as const).map((item) => {
            const active = item === category;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(item)}
                className={`text-[0.72rem] tracking-[0.16em] uppercase ${
                  active ? "text-ink underline decoration-ink underline-offset-[0.45rem]" : "text-ink/45 hover:text-ink"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
        <label className="block w-full md:w-64">
          <span className="sr-only">Search the shop</span>
          <input
            className="input mt-0"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            type="search"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-ink/60">Nothing matches that search.</p>
      ) : (
        <ul data-reveal className="grid gap-x-10 gap-y-12 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <li key={product.slug} className="flex flex-col">
              <button
                type="button"
                className="group block w-full text-left"
                aria-haspopup="dialog"
                onClick={() => setSelected(product)}
              >
                <span className="relative flex h-52 items-center justify-center overflow-hidden bg-white">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 22rem, 50vw"
                      className={`${product.image.endsWith(".webp") ? "object-contain p-6 mix-blend-multiply" : "object-cover"} transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none`}
                    />
                  ) : (
                    <span className="font-serif text-2xl text-ink/25" aria-hidden="true">
                      {product.category}
                    </span>
                  )}
                </span>
              </button>
              <h2 className="mt-5 font-serif text-2xl tracking-[-0.03em]">
                <button
                  type="button"
                  className="text-left"
                  aria-haspopup="dialog"
                  onClick={() => setSelected(product)}
                >
                  {product.name}
                </button>
              </h2>
              <p className="mt-1 text-ink/55">
                {formatPrice(product.price)} · {product.unit}
              </p>
              <p className="mt-3 max-w-[36ch] flex-1 text-ink/70">{product.summary}</p>
              <button type="button" className="link mt-4 self-start" onClick={() => addOne(product.slug)}>
                {added === product.slug ? "Added" : "Add to basket"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected ? (
        <dialog
          ref={dialogRef}
          className="product-dialog fixed inset-0 m-0 grid h-dvh max-h-none w-screen max-w-none place-items-center overflow-y-auto bg-transparent p-4"
          aria-labelledby={`product-dialog-title-${selected.slug}`}
          onCancel={(event) => {
            event.preventDefault();
            setSelected(null);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <article className="product-modal-panel relative grid w-full max-w-3xl overflow-hidden bg-paper shadow-2xl md:grid-cols-2">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-paper/90"
              aria-label="Close product details"
              onClick={() => setSelected(null)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <div className="relative min-h-64 bg-white md:min-h-[30rem]">
              {selected.image ? (
                <Image
                  src={selected.image}
                  alt={selected.name}
                  fill
                  sizes="(min-width: 768px) 24rem, 100vw"
                  className={selected.image.endsWith(".webp") ? "object-contain p-8 mix-blend-multiply" : "object-cover"}
                />
              ) : (
                <div className="grid h-full min-h-64 place-items-center font-serif text-2xl text-ink/30">
                  {selected.category}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              <p className="eyebrow">{selected.category}</p>
              <h2 id={`product-dialog-title-${selected.slug}`} className="mt-3 font-serif text-3xl tracking-[-0.03em]">
                {selected.name}
              </h2>
              <p className="mt-3 text-ink/60">
                {formatPrice(selected.price)} · {selected.unit}
              </p>
              <p className="mt-5 text-ink/75">{selected.summary}</p>
              <button type="button" className="btn mt-8 w-full" onClick={() => addOne(selected.slug)}>
                {added === selected.slug ? "Added to basket" : "Add to basket"}
              </button>
              {added === selected.slug ? (
                <p className="mt-4 text-center">
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

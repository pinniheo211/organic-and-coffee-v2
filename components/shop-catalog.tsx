"use client";

import { useCart } from "@/components/cart-provider";
import { categories, formatPrice, type Category, type Product } from "@/lib/catalog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export function ShopCatalog({ products }: { products: Product[] }) {
  const { add } = useCart();
  const [category, setCategory] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [tabScroll, setTabScroll] = useState({ back: false, forward: false });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tabList = tabListRef.current;
    if (!tabList) return;

    const updateTabScroll = () => {
      const maxScroll = tabList.scrollWidth - tabList.clientWidth;
      setTabScroll({
        back: tabList.scrollLeft > 2,
        forward: tabList.scrollLeft < maxScroll - 2,
      });
    };

    updateTabScroll();
    tabList.addEventListener("scroll", updateTabScroll, { passive: true });
    window.addEventListener("resize", updateTabScroll);

    return () => {
      tabList.removeEventListener("scroll", updateTabScroll);
      window.removeEventListener("resize", updateTabScroll);
    };
  }, []);

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

  function openProduct(product: Product) {
    setSelected(product);
    setQuantity(1);
    setAdded(null);
  }

  function addSelected() {
    if (!selected) return;
    add(selected.slug, quantity);
    setAdded(selected.slug);
  }

  function closeProductModal() {
    dialogRef.current?.close();
    setSelected(null);
  }

  return (
    <div className="mx-auto max-w-[76rem] px-5 pb-20">
      <div className="sticky top-[var(--header-h)] z-40 -mx-5 border-y border-line bg-paper px-5 py-3.5">
        <div className="flex items-center gap-2">
          {tabScroll.forward || tabScroll.back ? (
            <button
              type="button"
              className="grid size-10 shrink-0 place-items-center  text-ember disabled:opacity-35 md:hidden"
              aria-label="Scroll categories left"
              disabled={!tabScroll.back}
              onClick={() => tabListRef.current?.scrollBy({ left: -180, behavior: "smooth" })}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
          ) : null}
          <div
            ref={tabListRef}
            className="shop-category-tabs flex min-w-0 flex-1 gap-3 overflow-x-auto overscroll-x-contain pb-1 md:flex-none"
            role="tablist"
            aria-label="Departments"
          >
            {(["All", ...categories] as const).map((item) => {
              const active = item === category;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(item)}
                  className={`shrink-0 border-b-2 px-4 py-2 text-sm transition-colors ${
                    active ? "border-ember text-forest" : "border-transparent text-ink/75 hover:border-ember hover:text-ember"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
          {tabScroll.forward || tabScroll.back ? (
            <button
              type="button"
              className="grid size-10 shrink-0 place-items-center  text-ember disabled:opacity-35 md:hidden"
              aria-label="Scroll categories right"
              disabled={!tabScroll.forward}
              onClick={() => tabListRef.current?.scrollBy({ left: 180, behavior: "smooth" })}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          ) : null}
        </div>
        {/* <label className="block w-full md:w-64">
          <span className="sr-only">Search the shop</span>
          <input
            className="input mt-0"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            type="search"
          />
        </label> */}
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
                onClick={() => openProduct(product)}
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
                  onClick={() => openProduct(product)}
                >
                  {product.name}
                </button>
              </h2>
              <p className="mt-1 text-ink/55">
                {formatPrice(product.price)} · {product.unit}
              </p>
              <p className="mt-3 max-w-[36ch] flex-1 text-ink/70">{product.summary}</p>
              <button
                type="button"
                className="link mt-4 self-start cursor-pointer"
                aria-haspopup="dialog"
                onClick={() => openProduct(product)}
              >
                {added === product.slug ? "Added · Add more" : "Add to basket"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected ? (
        <dialog
          ref={dialogRef}
          className="product-dialog fixed inset-0 m-0 flex h-dvh max-h-none w-screen max-w-none items-start justify-center overflow-y-auto bg-transparent p-4"
          aria-labelledby={`product-dialog-title-${selected.slug}`}
          onCancel={() => setSelected(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeProductModal();
            }
          }}
          onClose={() => setSelected(null)}
        >
          <article className="product-modal-panel relative my-auto grid max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-x-hidden overflow-y-auto bg-paper shadow-2xl md:grid-cols-2">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-paper/90"
              aria-label="Close product details"
              onClick={closeProductModal}
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

              <div className="mt-7 flex items-center justify-between border-y border-line py-4">
                <span className="text-sm">Quantity</span>
                <div className="flex items-center border border-line" role="group" aria-label={`Quantity for ${selected.name}`}>
                  <button
                    type="button"
                    className="grid size-11 place-items-center disabled:opacity-40"
                    aria-label={`Decrease quantity of ${selected.name}`}
                    disabled={quantity <= 1 || added === selected.slug}
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  >
                    −
                  </button>
                  <output className="w-10 text-center tabular-nums" aria-live="polite">{quantity}</output>
                  <button
                    type="button"
                    className="grid size-11 place-items-center disabled:opacity-40"
                    aria-label={`Increase quantity of ${selected.name}`}
                    disabled={added === selected.slug}
                    onClick={() => setQuantity((current) => current + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="mt-3 flex justify-between text-sm">
                <span className="text-ink/60">Subtotal</span>
                <span className="font-medium tabular-nums">{formatPrice(selected.price * quantity)}</span>
              </p>
              <button
                type="button"
                className="btn mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
                onClick={addSelected}
                disabled={added === selected.slug}
              >
                {added === selected.slug ? "Added to basket" : `Add ${quantity} to basket`}
              </button>
              {added === selected.slug ? (
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

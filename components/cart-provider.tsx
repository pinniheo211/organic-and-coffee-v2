"use client";

import { getProduct } from "@/lib/catalog";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const storageKey = "organic-market-basket";

export type CafeCartLine = {
  kind: "cafe";
  slug: string;
  qty: number;
  name: string;
  price: number;
  image: string;
  details: string[];
  note: string;
};

export type CartLine = { slug: string; qty: number } | CafeCartLine;
type NewCafeCartLine = Omit<CafeCartLine, "kind">;

type CartValue = {
  ready: boolean;
  lines: CartLine[];
  count: number;
  add: (slug: string, qty?: number) => void;
  addCafe: (line: NewCafeCartLine) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CartLine[];
        if (Array.isArray(parsed)) {
        setLines(parsed.filter((line): line is CartLine => {
          if (!line || typeof line.slug !== "string" || !Number.isFinite(line.qty) || line.qty < 1) return false;
          if ("kind" in line && line.kind === "cafe") {
            return typeof line.name === "string" && Number.isFinite(line.price) && Array.isArray(line.details);
          }
          return Boolean(getProduct(line.slug));
        }));
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(storageKey, JSON.stringify(lines));
  }, [lines, ready]);

  const value = useMemo<CartValue>(() => {
    return {
      ready,
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      add(slug, qty = 1) {
        setLines((current) => {
          const found = current.find((line) => line.slug === slug);
          if (!found) return [...current, { slug, qty }];
          return current.map((line) => (line.slug === slug ? { ...line, qty: line.qty + qty } : line));
        });
      },
      addCafe(line) {
        setLines((current) => {
          const found = current.find((item) => item.slug === line.slug);
          if (!found) return [...current, { ...line, kind: "cafe" }];
          return current.map((item) => (item.slug === line.slug ? { ...item, qty: item.qty + line.qty } : item));
        });
      },
      setQty(slug, qty) {
        setLines((current) =>
          qty < 1
            ? current.filter((line) => line.slug !== slug)
            : current.map((line) => (line.slug === slug ? { ...line, qty } : line)),
        );
      },
      remove(slug) {
        setLines((current) => current.filter((line) => line.slug !== slug));
      },
      clear() {
        setLines([]);
      },
    };
  }, [lines, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}

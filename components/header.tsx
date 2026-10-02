"use client";

import { useCart } from "@/components/cart-provider";
import { MobileNavigation } from "@/components/mobile-navigation";
import { nav } from "@/lib/site";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const closeMenu = useCallback(() => setOpenPath(null), []);
  const basketLabel = ready && count > 0 ? `Basket, ${count}` : "Basket";

  return (
    <header style={{ viewTransitionName: "site-header" }} className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="mx-auto grid max-w-[88rem] grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5 md:grid-cols-[1fr_auto_1fr] md:px-8">
        <Link href="/" className="leading-none" aria-label="Organic Market, home">
          <span className="block font-serif text-[1.65rem] leading-none tracking-[-0.03em] md:text-[1.85rem]">
            Organic Market
          </span>
          <span className="mt-1 block text-[0.78rem] text-ink/55">and café, Stirling</span>
        </Link>

        <nav className="hidden items-center justify-center gap-7 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-[0.72rem] tracking-[0.16em] uppercase ${
                  active
                    ? "text-ink underline decoration-ink underline-offset-[0.45rem]"
                    : "text-ink/50 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-4">
          <Link href="/shop/basket" className="relative grid size-11 place-items-center" aria-label={basketLabel}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 8h16l-1.2 12H5.2L4 8Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {ready && count > 0 ? (
              <span className="absolute right-0 top-0 grid size-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[0.65rem] leading-none text-white">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </Link>
          <Link href="/login" className="hidden size-11 place-items-center lg:grid" aria-label="Login">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Link>
          <div className="hidden md:block">
            <Link href="/shop" className="btn px-4 py-2.5">
              Shop online
            </Link>
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-haspopup="dialog"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <MobileNavigation open={open} onClose={closeMenu} />
    </header>
  );
}

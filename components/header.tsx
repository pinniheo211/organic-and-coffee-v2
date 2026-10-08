"use client";

import { useCart } from "@/components/cart-provider";
import { MobileNavigation } from "@/components/mobile-navigation";
import { nav } from "@/lib/site";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

export function Header({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const closeMenu = useCallback(() => setOpenPath(null), []);
  const basketLabel = ready && count > 0 ? `Basket, ${count}` : "Basket";

  return (
    <header style={{ viewTransitionName: "site-header" }} className="site-header sticky top-0 z-50 border-b border-line bg-paper">
      <div className="mx-auto grid max-w-[88rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-5 sm:py-3.5 md:px-8">
        <button
          type="button"
          className="site-menu-trigger grid size-10 place-items-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-haspopup="dialog"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpenPath(open ? null : pathname)}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" />
            ) : (
              <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.5" />
            )}
          </svg>
        </button>

        <nav className="site-primary-nav hidden items-center gap-5 md:flex lg:gap-8" aria-label="Primary">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center whitespace-nowrap text-xs font-medium tracking-[0.12em] uppercase lg:text-sm ${
                  active
                    ? "text-ink underline decoration-ink underline-offset-[0.45rem]"
                    : "text-ink/85 hover:text-ember"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/" className="site-wordmark leading-none" aria-label="Organic Market, home">
          <span data-site-logo className="block whitespace-nowrap font-serif text-[1.05rem] leading-none tracking-[-0.04em] sm:text-[1.65rem] md:text-[1.85rem]">
            Organic Market
          </span>
        </Link>

        <div className="site-header-actions flex items-center justify-end gap-1 sm:gap-2">
          {isAuthenticated ? (
            <Link href="/account" className="grid size-9 place-items-center sm:size-11" aria-label="Your account">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>
          ) : (
            <Link href="/login" className="btn site-login-link">Login</Link>
          )}
          <Link href="/shop/basket" className="relative hidden size-9 place-items-center md:grid md:size-11" aria-label={basketLabel}>
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
        </div>
      </div>

      <MobileNavigation open={open} onClose={closeMenu} />
    </header>
  );
}

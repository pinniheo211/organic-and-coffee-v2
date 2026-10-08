"use client";

import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useRef } from "react";
import { useCart } from "@/components/cart-provider";
import { nav } from "@/lib/site";

const MENU_DURATION = 0.6;
const MENU_EASE = "power3.inOut";

export function MobileNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const unlockRef = useRef<((restoreScroll?: boolean) => void) | null>(null);
  const lockedPath = useRef<string | null>(null);
  const pathname = usePathname();
  const { count, ready } = useCart();
  const basketLabel = ready && count > 0 ? `Basket, ${count}` : "Basket";

  const dismiss = useCallback((restoreScroll = true) => {
    dialogRef.current?.close();
    unlockRef.current?.(restoreScroll);
    unlockRef.current = null;
    lockedPath.current = null;
  }, []);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (open) {
      if (!unlockRef.current) {
        const { body, documentElement } = document;
        const x = window.scrollX;
        const y = window.scrollY;
        const properties = ["position", "top", "left", "right", "width", "overflow", "padding-right"] as const;
        const saved = properties.map((property) => ({
          property,
          value: body.style.getPropertyValue(property),
          priority: body.style.getPropertyPriority(property),
        }));
        const overflow = documentElement.style.overflow;
        const scrollbar = window.innerWidth - documentElement.clientWidth;
        const padding = parseFloat(getComputedStyle(body).paddingRight);

        // Fixed positioning also prevents background touch scrolling on iOS.
        body.style.position = "fixed";
        body.style.top = `-${y}px`;
        body.style.left = `-${x}px`;
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";
        if (scrollbar > 0) body.style.paddingRight = `${padding + scrollbar}px`;
        documentElement.style.overflow = "hidden";
        lockedPath.current = pathname;
        unlockRef.current = (restoreScroll = true) => {
          saved.forEach(({ property, value, priority }) => {
            if (value) body.style.setProperty(property, value, priority);
            else body.style.removeProperty(property);
          });
          documentElement.style.overflow = overflow;
          if (restoreScroll) window.scrollTo({ left: x, top: y, behavior: "instant" });
        };
      }

      if (!dialog.open) dialog.showModal();
      dialog.scrollTop = 0;
      const entrance = gsap.timeline();
      entrance.fromTo(dialog, { opacity: 0, y: -24 }, {
        opacity: 1, y: 0, duration: reduceMotion ? 0 : MENU_DURATION, ease: MENU_EASE,
      });
      entrance.fromTo(dialog.querySelectorAll("[data-menu-item]"), { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: reduceMotion ? 0 : 0.34,
        stagger: reduceMotion ? 0 : 0.045, ease: "power3.out", clearProps: "opacity,transform",
      }, reduceMotion ? 0 : 0.08);
      return () => { entrance.kill(); };
    }

    // Route changes must unlock before Next restores the destination's scroll.
    if (lockedPath.current !== null && lockedPath.current !== pathname) {
      dismiss(false);
      onClose();
      return;
    }
    if (!dialog.open) return;
    const exit = gsap.timeline({ onComplete: () => dismiss() });
    exit.to(dialog.querySelectorAll("[data-menu-item]"), {
      opacity: 0, y: 18, duration: reduceMotion ? 0 : 0.34,
      stagger: { each: reduceMotion ? 0 : 0.045, from: "end" }, ease: MENU_EASE,
    }, 0);
    exit.to(dialog, {
      opacity: 0, y: -24, duration: reduceMotion ? 0 : MENU_DURATION, ease: MENU_EASE,
    }, 0);
    return () => { exit.kill(); };
  }, [open, pathname, dismiss, onClose]);

  useLayoutEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (desktop.matches && dialogRef.current?.open) {
        dismiss();
        onClose();
      }
    };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, [dismiss, onClose]);

  useLayoutEffect(() => () => dismiss(), [dismiss]);

  const onNavigate = () => {
    // Release the old scroll position synchronously before Link navigates.
    dismiss();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      id="mobile-nav"
      aria-label="Navigation menu"
      className="mobile-menu"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-current/20 pb-4">
        <Link href="/" onNavigate={onNavigate} className="leading-none" aria-label="Organic Market, home">
          <span className="block font-serif text-[1.65rem] leading-none tracking-[-0.03em]">Organic Market</span>
        </Link>
        <button type="button" autoFocus className="mobile-menu-close grid size-11 place-items-center" aria-label="Close navigation" onClick={onClose}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      <nav aria-label="Mobile primary" className="my-auto shrink-0 py-8">
        <ul className="grid gap-3">
          {nav.map((item) => (
            <li key={item.href} data-menu-item>
              <Link href={item.href} onNavigate={onNavigate} aria-current={pathname === item.href ? "page" : undefined} className="block py-1 font-serif text-4xl tracking-[-0.03em]">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav className="shrink-0 border-t border-current/20 py-5" aria-label="Online shopping and café menu">
        <ul className="grid">
          <li data-menu-item>
            <Link
              href="/shop"
              onNavigate={onNavigate}
              aria-current={pathname === "/shop" ? "page" : undefined}
              className="block border-b border-current/15 py-3 font-serif text-2xl transition-colors hover:text-[var(--leaf)]"
            >
              Shop Online
            </Link>
          </li>
          <li data-menu-item>
            <Link
              href="/cafe/menu"
              onNavigate={onNavigate}
              aria-current={pathname === "/cafe/menu" ? "page" : undefined}
              className="block border-b border-current/15 py-3 font-serif text-2xl transition-colors hover:text-[var(--leaf)]"
            >
              See our menu
            </Link>
          </li>
        </ul>
      </nav>
      <div data-menu-item className="grid shrink-0 grid-cols-2 gap-3 border-t border-current/20 pt-6">
        <Link href="/login" onNavigate={onNavigate} className="btn w-full">Sign in</Link>
        <Link href="/shop/basket" onNavigate={onNavigate} aria-label={basketLabel} className="btn-line inline-flex min-h-11 items-center justify-center gap-2">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 8h16l-1.2 12H5.2L4 8Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span>Basket{ready && count > 0 ? ` (${count > 99 ? "99+" : count})` : ""}</span>
        </Link>
      </div>
    </dialog>
  );
}

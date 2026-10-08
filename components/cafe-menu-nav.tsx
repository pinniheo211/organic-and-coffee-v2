"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type MenuNavItem = { id: string; title: string };

export function CafeMenuNav({ sections }: { sections: MenuNavItem[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [overflow, setOverflow] = useState({ visible: false, left: false, right: false });
  const listId = useId();
  const stickyRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sticky = stickyRef.current;
    const nav = navRef.current;
    const scroller = scrollerRef.current;
    const list = listRef.current;
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!sticky || !nav || !scroller || !list) return;

    const updateLayout = () => {
      if (header) sticky.style.setProperty("--cafe-header-h", `${header.getBoundingClientRect().height}px`);
      const next = {
        visible: list.scrollWidth > nav.clientWidth + 1,
        left: scroller.scrollLeft > 1,
        right: scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1,
      };
      setOverflow((current) =>
        current.visible === next.visible && current.left === next.left && current.right === next.right
          ? current
          : next,
      );
    };

    const observer = new ResizeObserver(updateLayout);
    [nav, scroller, list, ...(header ? [header] : [])].forEach((element) => observer.observe(element));
    scroller.addEventListener("scroll", updateLayout, { passive: true });

    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", updateLayout);
    };
  }, [sections]);

  function scrollCategories(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  useEffect(() => {
    let frame = 0;
    const updateActiveSection = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const marker = (stickyRef.current?.getBoundingClientRect().bottom ?? 0) + 12;
        let nextActiveId = sections[0]?.id ?? "";

        for (const { id } of sections) {
          const section = document.getElementById(id);
          if (!section || section.getBoundingClientRect().top > marker) break;
          nextActiveId = id;
        }

        setActiveId((current) => current === nextActiveId ? current : nextActiveId);
        frame = 0;
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <div ref={stickyRef} className="sticky top-[var(--cafe-header-h,var(--header-h))] z-40 -mx-5 border-y border-line bg-paper px-5 py-3.5">
      <nav ref={navRef} aria-label="Menu sections" className="flex min-w-0 items-center">
        {overflow.visible ? (
          <button
            type="button"
            aria-label="Scroll menu categories left"
            aria-controls={listId}
            disabled={!overflow.left}
            onClick={() => scrollCategories(-1)}
            className="grid size-11 shrink-0 place-items-center border-0 bg-transparent text-forest hover:text-ember disabled:cursor-default disabled:opacity-30"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
        ) : null}
        <div ref={scrollerRef} className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain">
          <div ref={listRef} id={listId} className="flex w-max gap-3">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  aria-current={activeId === section.id ? "location" : undefined}
                  onClick={() => setActiveId(section.id)}
                  className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap border-b-2 px-4 py-2 text-sm transition-colors ${
                    activeId === section.id
                      ? "border-ember text-forest"
                      : "border-transparent text-ink/75 hover:border-ember hover:text-ember"
                  }`}
                >
                  {section.title}
                </a>
              ))}
          </div>
        </div>
        {overflow.visible ? (
          <button
            type="button"
            aria-label="Scroll menu categories right"
            aria-controls={listId}
            disabled={!overflow.right}
            onClick={() => scrollCategories(1)}
            className="grid size-11 shrink-0 place-items-center border-0 bg-transparent text-forest hover:text-ember disabled:cursor-default disabled:opacity-30"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        ) : null}
      </nav>
    </div>
  );
}

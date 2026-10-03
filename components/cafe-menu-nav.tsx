"use client";

import { useEffect, useRef, useState } from "react";

type MenuNavItem = { id: string; title: string };

export function CafeMenuNav({ sections }: { sections: MenuNavItem[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const updateActiveSection = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const marker = (navRef.current?.getBoundingClientRect().bottom ?? 0) + 12;
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
    <nav ref={navRef} aria-label="Menu sections" className="flex gap-3 overflow-x-auto overscroll-x-contain pb-1">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-current={activeId === section.id ? "location" : undefined}
          onClick={() => setActiveId(section.id)}
          className={`shrink-0 border-b-2 px-4 py-2 text-sm transition-colors ${
            activeId === section.id
              ? "border-ember text-forest"
              : "border-transparent text-ink/75 hover:border-ember hover:text-ember"
          }`}
        >
          {section.title}
        </a>
      ))}
    </nav>
  );
}

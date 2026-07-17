"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import type { Category } from "@/lib/types";

export default function CategoryNav({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState<string | null>(categories[0]?.slug ?? null);

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(`category-${c.slug}`))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id.replace("category-", ""));
          }
        });
      },
      { rootMargin: "-140px 0px -70% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [categories]);

  function scrollTo(slug: string) {
    const el = document.getElementById(`category-${slug}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  return (
    <div className="sticky top-16 z-30 bg-surface/95 backdrop-blur border-b border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-4 md:px-gutter">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => scrollTo(c.slug)}
              className={clsx(
                "shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap",
                active === c.slug
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

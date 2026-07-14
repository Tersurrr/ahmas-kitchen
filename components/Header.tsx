"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/videos", label: "Videos" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalCount = useCart((s) => s.totalCount());
  const openCart = useCart((s) => s.openCart);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-auto shadow-sm bg-surface/95 backdrop-blur">
      <div className="flex justify-between items-center h-16 px-4 md:px-gutter max-w-container-max mx-auto">
        <div className="flex items-center md:w-24">
          <button
            type="button"
            className="md:hidden p-2 hover:bg-surface-container transition-colors rounded-full"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav className="hidden md:flex gap-8 items-center">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              prefetch={true}
              className="text-sm font-semibold tracking-wide text-on-surface-variant hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/menu"
            prefetch={true}
            className="hidden md:inline-flex items-center px-5 py-2.5 rounded bg-primary text-on-primary text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            Order Now
          </Link>
          <button
            type="button"
            aria-label="Open cart"
            onClick={openCart}
            className="relative p-2 rounded-full hover:bg-surface-container transition-colors"
          >
            <ShoppingBag size={22} className="text-primary" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="absolute top-full inset-x-0 z-[55] md:hidden flex flex-col bg-surface border-t border-outline-variant/20 px-6 py-4 gap-4 shadow-soft">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              prefetch={true}
              onClick={() => setMobileOpen(false)}
              className="text-base font-semibold text-on-surface-variant hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

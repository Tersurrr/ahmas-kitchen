"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, PlayCircle, Info } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/#home", label: "Home", icon: Home },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/videos", label: "Videos", icon: PlayCircle },
  { href: "/#about", label: "About", icon: Info },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant/10 bg-surface shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center h-16 px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/#home" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              prefetch={true}
              className={clsx(
                "flex flex-col items-center justify-center gap-0.5 px-4 py-1 rounded-xl transition-colors",
                active ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant"
              )}
            >
              <Icon size={20} />
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

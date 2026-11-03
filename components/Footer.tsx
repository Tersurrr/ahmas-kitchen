import Link from "next/link";
import { Mail, Phone, MessageCircle, Facebook, Music2, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "18572615923";
const EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "sandrineamah25@gmail.com";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+1 (857) 261-5923";

export default function Footer() {
  return (
    <footer id="contact" className="bg-umber text-on-primary pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-10 px-4 md:px-gutter">
      <div className="max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <p className="text-sm text-white/80 mb-4">
              African dishes for pickup, delivery, and catering in Massachusetts.
            </p>
            <p className="text-xs font-bold tracking-widest uppercase text-champagne mb-3">
              Follow us
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-white/10 px-3 text-sm font-semibold text-white hover:bg-burgundy transition-colors"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Amahs Kitchen on Facebook"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-white/10 px-3 text-sm font-semibold text-white hover:bg-burgundy transition-colors"
              >
                <Facebook size={18} />
                Facebook
              </a>
              <a
                href={siteConfig.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Amahs Kitchen on TikTok"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-white/10 px-3 text-sm font-semibold text-white hover:bg-burgundy transition-colors"
              >
                <Music2 size={18} />
                TikTok
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-champagne mb-5">
              Quick Links
            </h2>
            <ul className="space-y-3 text-sm">
              <li><Link href="/menu" className="text-white/80 hover:text-champagne transition-colors">Menu</Link></li>
              <li><Link href="/videos" className="text-white/80 hover:text-champagne transition-colors">Videos</Link></li>
              <li><Link href="/#about" className="text-white/80 hover:text-champagne transition-colors">About</Link></li>
              <li><Link href="/#contact" className="text-white/80 hover:text-champagne transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-white/80 hover:text-champagne transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-white/80 hover:text-champagne transition-colors">Cookie Notice</Link></li>
              <li><Link href="/accessibility" className="text-white/80 hover:text-champagne transition-colors">Accessibility</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-champagne mb-5">
              Contact
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-white/80 hover:text-champagne transition-colors">
                  <Mail size={16} /> {EMAIL}
                </a>
              </li>
              <li>
                <a href={`tel:${PHONE_DISPLAY.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 text-white/80 hover:text-champagne transition-colors">
                  <Phone size={16} /> {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-champagne transition-colors"
                >
                  <MessageCircle size={16} /> WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-champagne mb-5">
              Hours
            </h2>
            <p className="text-sm text-white/80 mb-2">Pickup: Tue–Sun, 11am – 7pm</p>
            <p className="text-sm text-white/80">Delivery: Tue–Sun, 12pm – 6pm</p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} Amahs kitchen. All Rights Reserved
          </p>
          <div className="flex gap-2 items-center">
            <ShieldCheck size={16} className="text-champagne" />
            <span className="text-xs text-white/70">
              Registered Business in the State of Massachusetts
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

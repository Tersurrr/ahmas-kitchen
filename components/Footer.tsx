import Link from "next/link";
import { Mail, Phone, MessageCircle, Facebook, ShieldCheck } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "18572615923";
const EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "sandrineamah25@gmail.com";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+1 (857) 261-5923";

export default function Footer() {
  return (
    <footer id="contact" className="bg-surface-container-highest pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-10 px-4 md:px-gutter">
      <div className="max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <p className="text-sm text-on-surface-variant mb-4">
              Amahs kitchen is a professionally operated food business committed to
              serving authentic African cuisine.
            </p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase text-primary mb-5">
              Quick Links
            </h5>
            <ul className="space-y-3 text-sm">
              <li><Link href="/menu" className="text-on-surface-variant hover:text-secondary transition-colors">Menu</Link></li>
              <li><Link href="/videos" className="text-on-surface-variant hover:text-secondary transition-colors">Videos</Link></li>
              <li><Link href="/#about" className="text-on-surface-variant hover:text-secondary transition-colors">About</Link></li>
              <li><Link href="/#contact" className="text-on-surface-variant hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase text-primary mb-5">
              Contact
            </h5>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors">
                  <Mail size={16} /> {EMAIL}
                </a>
              </li>
              <li>
                <a href={`tel:${PHONE_DISPLAY.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors">
                  <Phone size={16} /> {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors"
                >
                  <MessageCircle size={16} /> WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase text-primary mb-5">
              Hours
            </h5>
            <p className="text-sm text-on-surface-variant mb-2">Pickup: Tue–Sun, 11am – 7pm</p>
            <p className="text-sm text-on-surface-variant">Delivery: Tue–Sun, 12pm – 6pm</p>
          </div>
        </div>

        <div className="border-t border-outline-variant/30 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()} Amahs kitchen. All Rights Reserved
          </p>
          <div className="flex gap-2 items-center">
            <ShieldCheck size={16} className="text-secondary" />
            <span className="text-xs text-on-surface-variant">
              Registered Business in the State of Massachusetts
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

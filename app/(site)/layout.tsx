import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import AddedToCartToast from "@/components/AddedToCartToast";
import WelcomeNotification from "@/components/WelcomeNotification";
import CookieConsent from "@/components/CookieConsent";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16 pb-20 md:pb-0 min-h-screen">{children}</main>
      <BottomNav />
      <CartDrawer />
      <AddedToCartToast />
      <WelcomeNotification />
      <CookieConsent />
    </>
  );
}

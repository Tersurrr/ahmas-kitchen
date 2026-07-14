import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import AddedToCartToast from "@/components/AddedToCartToast";
import WelcomeNotification from "@/components/WelcomeNotification";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16 pb-20 md:pb-0 min-h-screen">{children}</main>
      <Footer />
      <BottomNav />
      <CartDrawer />
      <AddedToCartToast />
      <WelcomeNotification />
    </>
  );
}

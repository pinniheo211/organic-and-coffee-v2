import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PageMotion } from "@/components/page-motion";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const coconat = localFont({
  src: [
    { path: "./fonts/coconat/Coconat-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/coconat/Coconat-Demi.woff2", weight: "500", style: "normal" },
    { path: "./fonts/coconat/Coconat-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-coconat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Organic Market and Café",
    template: "%s · Organic Market",
  },
  description:
    "Organic and wholefood market and vegetarian café in Stirling, Adelaide Hills. Supply for kitchens, retailers and households since 1982.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${coconat.variable} h-full`}>
      <body className="min-h-full bg-paper font-sans text-[1.05rem] leading-relaxed text-ink antialiased">
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <CartProvider>
          <Header />
          <main id="content"><PageMotion>{children}</PageMotion></main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

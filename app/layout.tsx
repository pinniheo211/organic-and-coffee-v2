import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
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

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
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
    <html lang="en" className={`${dmSans.variable} ${instrument.variable} h-full`}>
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

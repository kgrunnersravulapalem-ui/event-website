import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer/Footer";
import Ticker from "@/components/layout/Ticker/Ticker";
import Navbar from "@/components/layout/Navbar/Navbar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-main",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "KONASEEMA RUN 2026 - Ravulapalem",
    template: "%s | KONASEEMA RUN 2026",
  },
  description: "Join the most anticipated running event in Ravulapalem! KONASEEMA RUN 2026 offering 3K, 5K, and 10K categories. Register now to experience health and community.",
  keywords: ["Konaseema Run", "Ravulapalem Marathon", "Andhra Pradesh Run", "10K Run Konaseema", "5K Run Ravulapalem", "Our Health Our Village", "Konaseema Godavari Runners"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PhonePe Checkout Script for iframe payment integration */}
        <script src="https://mercury.phonepe.com/web/bundle/checkout.js" defer></script>
      </head>
      <body className={`${outfit.variable} font-sans`}>
        {/* Ticker and Navbar are global now, so pages don't need to import them repeatedly */}
        <Ticker />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

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
  title: "RunEvent - Ultimate Marathon Experience",
  description: "Join the run, experience the thrill, and push your limits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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

import type { Metadata } from "next";
import { Outfit, Bricolage_Grotesque, Plus_Jakarta_Sans, Anek_Telugu } from "next/font/google";
import "./globals.css";
import "./kg.css";
import Footer from "@/components/layout/Footer/Footer";
import Navbar from "@/components/layout/Navbar/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import AnnouncementBar from "@/components/kg/AnnouncementBar";

// Outfit is still used by the inner pages (register, prizes, results…)
const outfit = Outfit({ subsets: ["latin"], variable: "--font-main", weight: ["300", "400", "500", "600", "700"] });
// Edition 02 design fonts: Bricolage Grotesque (headlines) + Plus Jakarta Sans (menu, body, labels)
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", axes: ["opsz"] });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body" });
const telugu = Anek_Telugu({ subsets: ["telugu"], variable: "--font-telugu", weight: ["500", "700"] });

export const metadata: Metadata = {
  title: {
    default: "Konaseema Half Marathon 2027 · 2nd Edition | Ravulapalem",
    template: "%s | Konaseema Half Marathon 2027",
  },
  description:
    "Konaseema Half Marathon, 2nd Edition — 31 January 2027, Ravulapalem. The first-ever half marathon in Konaseema District. Timed 5K, 10K and 21.1K, and a non-timed 3K.",
  keywords: [
    "Konaseema Half Marathon",
    "Konaseema Run 2027",
    "Ravulapalem Marathon",
    "Half Marathon Andhra Pradesh",
    "21.1K Konaseema",
    "Jai Jawan Jai Kisan Run",
    "Konaseema Godavari Runners",
  ],
  icons: {
    icon: "/icon.png",
  },
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
      <body className={`${outfit.variable} ${display.variable} ${body.variable} ${telugu.variable} font-sans`}>
        <ScrollToTop />
        <Navbar />
        <AnnouncementBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

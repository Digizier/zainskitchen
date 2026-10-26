import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://zainskitchen.com"),
  title: "Zain's Kitchen | Homemade Food, Lunch Boxes & Restaurant Dishes in Peshawar",
  description: "Zain's Kitchen offers fresh, hygienic, homemade lunch boxes, royal chicken karahi, nihari, and aromatic biryani in Peshawar. Order fresh daily on WhatsApp: 0303-8835378.",
  keywords: ["Zain's Kitchen", "Lunch box Peshawar", "homemade food Peshawar", "Chicken Biryani Peshawar", "Chicken Nihari", "office lunch delivery Peshawar", "cloud kitchen Peshawar"],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Zain's Kitchen | Where Taste Meets Passion",
    description: "Ghar jaisa khana, ab aapke liye har roz! Delicious homemade meals, lunch boxes, and catering in Peshawar.",
    url: "https://zainskitchen.com",
    siteName: "Zain's Kitchen",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zain's Kitchen Official Emblem",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-obsidian-900 text-cream-100 min-h-screen flex flex-col selection:bg-gold-500 selection:text-obsidian-950`}
      >
        <ScrollToTop />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}

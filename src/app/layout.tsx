import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "400", "700", "800"],
});

export const metadata: Metadata = {
  title: "Wellcore Science - Engineered For Performance",
  description: "Premium fitness supplements engineered for peak performance. Backed by science, driven by results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="light"
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className={`${inter.variable} ${manrope.variable} bg-surface font-body text-on-surface antialiased flex flex-col min-h-screen`}>
        <Providers>
          <Toaster position="bottom-right" />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}

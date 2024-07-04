import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import Header from "./components/header";
import Footer from "./components/footer";

const inter = Roboto_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SHOP.CO",
  description: "FIND CLOTHES THAT MATCHES YOUR STYLE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

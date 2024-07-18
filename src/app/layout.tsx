"use client";

import React from "react";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import Layout from "./home/page";
import { usePathname } from "next/navigation";

const inter = Roboto_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        {pathname === "/login" || pathname === "/signup" ? (
          children
        ) : (
          <Layout>{children}</Layout>
        )}
      </body>
    </html>
  );
}

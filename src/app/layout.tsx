// src/app/layout.tsx
"use client";
import React from "react";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import Header from "./components/header";
import Footer from "./components/footer";
import { AuthProvider, useAuth } from "./components/Authcontent/authcontent";

const inter = Roboto_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <html lang="en" data-theme="light">
        <body className={inter.className}>
          {pathname === "/login" || pathname === "/signup" ? (
            children
          ) : (
            <ProtectedLayout>{children}</ProtectedLayout>
          )}
        </body>
      </html>
    </AuthProvider>
  );
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in to see this content.</div>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

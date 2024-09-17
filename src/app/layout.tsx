// src/app/layout.tsx
"use client";
import React from "react";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import Header from "./components/header";
import Footer from "./components/footer";
import { AuthProvider, useAuth } from "./components/Authcontent/authcontent";
import Link from "next/link";
import Login from "./login/page";
import { Provider } from "react-redux";
import { store } from "./store/store";

const inter = Roboto_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <Provider store={store}>
        <html lang="en" data-theme="light">
          <body className={inter.className}>
            {pathname === "/login" || pathname === "/signup" ? (
              children
            ) : (
              <ProtectedLayout>{children}</ProtectedLayout>
            )}
          </body>
        </html>
      </Provider>
    </AuthProvider>
  );
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container">
        <Login />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

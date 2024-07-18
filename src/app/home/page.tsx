import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

interface LayoutProps {
  children: React.ReactNode;
}

export const constLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

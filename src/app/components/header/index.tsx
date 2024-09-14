"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import localFont from "next/font/local";
import { signOut } from "firebase/auth";
import { auth, db } from "@/farebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation"; // For Next.js navigation

const integralCF = localFont({
  src: "../../../fonts/IntegralCF/IntegralCF-Bold.ttf",
  display: "swap",
});

const satoshi = localFont({
  src: "../../../fonts/satoshi/Satoshi-Variable.ttf",
  display: "swap",
});

export default function Header() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const router = useRouter(); // Hook for navigation

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (storedUser) {
      setUser(storedUser);
    } else {
      // Re-authenticate if no data in localStorage
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          const userData = {
            uid: currentUser.uid,
            email: currentUser.email,
            photoURL: currentUser.photoURL, // Fetch photoURL
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      });

      return () => unsubscribe(); // Cleanup subscription
    }
  }, []);

  useEffect(() => {
    const fetchCartItemCount = async () => {
      if (!user) {
        return;
      }

      try {
        const cartRef = doc(db, "cart", user.uid);
        const cartSnap = await getDoc(cartRef);

        if (cartSnap.exists()) {
          const cartData = cartSnap.data();
          const itemCount = cartData.items ? cartData.items.length : 0;
          setCartItemCount(itemCount);
        } else {
          setCartItemCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart item count:", error);
      }
    };

    fetchCartItemCount();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="pt-1 pb-1">
      <div className="container navbar bg-base-100">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link
            href="/"
            className={`text-3xl font-bold pb-1 ${integralCF.className}`}
          >
            SHOP.CO
          </Link>
          <nav>
            <ul
              className={`flex space-x-4 items-center justify-between ${satoshi.className}`}
            >
              <li>
                <Link href="/details">Shop</Link>
              </li>
              <li>
                <Link href="/details">On Sale</Link>
              </li>
              <li>
                <Link href="/details">New Arrivals</Link>
              </li>
              <li>
                <Link href="/card">Cart</Link>
              </li>
            </ul>
          </nav>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="input input-bordered w-[577px] h-[48px] pl-7 pr-3 rounded-3xl bg-[#F0F0F0]"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 left-2 top-3.5 absolute z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <Link href="/card" className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartItemCount > 0 && (
                  <span className="badge badge-sm indicator-item">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src={
                    user?.photoURL ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <button onClick={handleLogout} className="w-full text-left">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

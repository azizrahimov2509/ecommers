"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import localFont from "next/font/local";
import { signOut } from "firebase/auth";
import { auth, db } from "@/farebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { setQuery } from "@/app/store/searchSlice";

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
  const [search, setSearch] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Состояние для отслеживания активного пути
  const [activePath, setActivePath] = useState(window.location.pathname);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (storedUser) {
      setUser(storedUser);
      subscribeToCartChanges(storedUser.uid);
    } else {
      const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          const userData = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || "Anonymous",
            photoURL:
              "https://www.visualfacilitators.com/wp-content/uploads/2021/07/testimonial_anonymous-person_icon.png",
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          subscribeToCartChanges(userData.uid);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const subscribeToCartChanges = (uid: string) => {
    const cartRef = doc(db, "cart", uid);

    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      const cartData = docSnap.data();
      const itemCount = cartData?.items ? cartData.items.length : 0;
      setCartItemCount(itemCount);
    });

    return () => unsubscribe();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setUser(null);
      setCartItemCount(0);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    dispatch(setQuery(value));
    if (value) {
      router.push(`/searchRes?query=${encodeURIComponent(value)}`);
    } else {
      router.push(`/searchRes`);
    }
  };

  // Функция для добавления активного класса
  const getLinkClass = (path: string) => {
    return activePath === path ? "active" : "";
  };

  return (
    <header className="pt-1 pb-1 bg-white shadow-md">
      <div className="container navbar bg-base-100">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link
            href="/"
            className={`text-3xl font-bold pb-1 ${integralCF.className} `}
            onClick={() => setActivePath("/")}
          >
            SHOP.CO
          </Link>

          <nav>
            <ul className={`flex space-x-4 items-center ${satoshi.className}`}>
              <li>
                <Link
                  href="/searchRes"
                  className={getLinkClass("/searchRes")}
                  onClick={() => setActivePath("/searchRes")}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/details"
                  className={getLinkClass("/details")}
                  onClick={() => setActivePath("/details")}
                >
                  On Sale
                </Link>
              </li>
              <li>
                <Link
                  href="/details"
                  className={getLinkClass("/details")}
                  onClick={() => setActivePath("/details")}
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/card"
                  className={getLinkClass("/card")}
                  onClick={() => setActivePath("/card")}
                >
                  Cart
                </Link>
              </li>
            </ul>
          </nav>

          <div className="relative w-[500px]">
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={handleSearchChange}
              className="input input-bordered w-full h-[48px] pl-10 pr-3 rounded-3xl bg-[#F0F0F0]"
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

          <div className="relative ml-4 ">
            <Link href="/card" className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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

          <div>
            <Link href="/orders" className="flex items-center">
              <span className="text-lg font-semibold text-center ">
                Ваш заказ
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar "
              >
                <div className="w-10 rounded-full flex items-center">
                  <img
                    alt="User avatar"
                    src={
                      "https://www.visualfacilitators.com/wp-content/uploads/2021/07/testimonial_anonymous-person_icon.png"
                    }
                    className="w-10 h-10 rounded-full"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a className="justify-between">
                    {user?.displayName || "Anonymous"}
                  </a>
                </li>

                <li>
                  <button onClick={handleLogout} className="w-full text-left">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
            <div className="ml-2 text-lg font-semibold">
              {user?.displayName}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

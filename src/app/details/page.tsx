"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import localFont from "next/font/local";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "@/farebase/config";

const integralCF = localFont({
  src: "../../fonts/IntegralCF/IntegralCF-Bold.ttf",
  display: "swap",
});

const satoshi = localFont({
  src: "../../fonts/satoshi/Satoshi-Variable.ttf",
  display: "swap",
});

interface Product {
  id: string;
  name: string;
  photo: string[];
  price: number;
  rating: number;
}

export default function Details() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [topSellings, setTopSellings] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");

        const newArrivalsQuery = query(productsRef, limit(4));
        const newArrivalsSnapshot = await getDocs(newArrivalsQuery);
        const newArrivalsData = newArrivalsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        setNewArrivals(newArrivalsData);

        const lastDoc =
          newArrivalsSnapshot.docs[newArrivalsSnapshot.docs.length - 1];
        const topSellingsQuery = query(
          productsRef,
          startAfter(lastDoc),
          limit(4)
        );
        const topSellingsSnapshot = await getDocs(topSellingsQuery);
        const topSellingsData = topSellingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        setTopSellings(topSellingsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <section className="mt-24">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-11 mb-20">
            <h1
              className={`${integralCF.className} text-black font-700 text-center text-5xl`}
            >
              NEW ARRIVALS
            </h1>
            <div className="flex items-center justify-between gap-6">
              {newArrivals.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col items-start justify-center gap-3 ${satoshi.className}`}
                >
                  <Link href={`/details/${item.id}`} className="cursor-pointer">
                    <Image
                      src={item.photo[0] || "/placeholder.png"}
                      alt={item.name}
                      width={290}
                      height={294}
                      className="h-72"
                    />
                  </Link>
                  <h4 className="text-[20px] leading-[27px] font-bold text-black">
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <input
                          key={star}
                          type="radio"
                          name={`rating-${item.id}`}
                          className="mask mask-star-2 bg-orange-400"
                          defaultChecked={item.rating >= star}
                        />
                      ))}
                    </div>
                    <p className="text-black">
                      {item.rating}/<span className="text-gray-600">5</span>
                    </p>
                  </div>
                  <h3 className="text-[24px] leading-[37px] font-bold">
                    ${item.price}
                  </h3>
                </div>
              ))}
            </div>
            <div>
              <button
                className={` ${satoshi.className} btn border-spacing-1 border-gray-200 rounded-3xl w-[218px] h-[52px] text-base leading-[21px] font-500 `}
              >
                View All
              </button>
            </div>
          </div>
          <hr />
        </div>
      </section>
      <section className="mt-24">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-11 mb-20">
            <h1
              className={`${integralCF.className} text-black font-700 text-center text-5xl`}
            >
              TOP SELLING
            </h1>
            <div className="flex items-center justify-between gap-6">
              {topSellings.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col items-start justify-center gap-3  ${satoshi.className} w-[290px]`}
                >
                  <Link href={`/details/${item.id}`} className="cursor-pointer">
                    <Image
                      src={item.photo[0] || "/placeholder.png"}
                      alt={item.name}
                      width={290}
                      height={294}
                      className="h-72"
                    />
                  </Link>
                  <h4 className="text-[20px] leading-[27px] font-bold text-black">
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <input
                          key={star}
                          type="radio"
                          name={`rating-${item.id}`}
                          className="mask mask-star-2 bg-orange-400"
                          defaultChecked={item.rating >= star}
                        />
                      ))}
                    </div>
                    <p className="text-black">
                      {item.rating}/<span className="text-gray-600">5</span>
                    </p>
                  </div>
                  <h3 className="text-[24px] leading-[37px] font-bold">
                    ${item.price}
                  </h3>
                </div>
              ))}
            </div>
            <div>
              <button
                className={` ${satoshi.className} btn border-spacing-1 border-gray-200 rounded-3xl w-[218px] h-[52px] text-base leading-[21px] font-500 `}
              >
                View All
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="">
        <div className="container">
          <div className="text-white bg-black rounded-3xl p-14 flex items-center justify-between gap-28">
            <h1
              className={`${integralCF.className} text-[40px] leading-[45px] font-700 `}
            >
              STAY UPTO DATE ABOUT OUR LATEST OFFERS
            </h1>

            <form className="flex flex-col gap-6 relative">
              <input
                type="email"
                placeholder="Enter your email address"
                className={`rounded-3xl p-4 w-[349px] h-[48px] ${satoshi.className} text-base text-black pl-8`}
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute top-3.5 left-3"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="black"
              >
                <path d="M2 3a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V3zm2-.5v4.943l6 3.499 6-3.499V2.5H4zm0 5.208V17.5h12V8.708l-6 3.5-6-3.5z" />
              </svg>
              <button
                className={`w-[349px] h-[48px] rounded-3xl bg-white border-e-2 border-black ${satoshi.className} text-black text-base  font-bold`}
              >
                Subscribe to Newsletter
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

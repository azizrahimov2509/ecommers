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
  QueryDocumentSnapshot,
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
  const [newArrivalsAll, setNewArrivalsAll] = useState<Product[]>([]);
  const [topSellingsAll, setTopSellingsAll] = useState<Product[]>([]);
  const [newArrivalsLastDoc, setNewArrivalsLastDoc] =
    useState<QueryDocumentSnapshot | null>(null);
  const [topSellingsLastDoc, setTopSellingsLastDoc] =
    useState<QueryDocumentSnapshot | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showAllNewArrivals, setShowAllNewArrivals] = useState(false);
  const [showAllTopSellings, setShowAllTopSellings] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");

        // Fetch initial new arrivals
        const newArrivalsQuery = query(productsRef, limit(4));
        const newArrivalsSnapshot = await getDocs(newArrivalsQuery);
        const newArrivalsData = newArrivalsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        setNewArrivals(newArrivalsData);
        setNewArrivalsAll(newArrivalsData);
        setNewArrivalsLastDoc(
          newArrivalsSnapshot.docs[newArrivalsSnapshot.docs.length - 1]
        );

        // Fetch initial top sellings
        const topSellingsQuery = query(
          productsRef,
          startAfter(
            newArrivalsSnapshot.docs[newArrivalsSnapshot.docs.length - 1]
          ),
          limit(4)
        );
        const topSellingsSnapshot = await getDocs(topSellingsQuery);
        const topSellingsData = topSellingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        setTopSellings(topSellingsData);
        setTopSellingsAll(topSellingsData);
        setTopSellingsLastDoc(
          topSellingsSnapshot.docs[topSellingsSnapshot.docs.length - 1]
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const fetchMoreProducts = async (type: "newArrivals" | "topSellings") => {
    if (loadingMore) return;

    setLoadingMore(true);
    try {
      const productsRef = collection(db, "products");

      if (type === "newArrivals" && newArrivalsLastDoc) {
        const newArrivalsQuery = query(
          productsRef,
          startAfter(newArrivalsLastDoc),
          limit(4)
        );
        const newArrivalsSnapshot = await getDocs(newArrivalsQuery);
        const newArrivalsData = newArrivalsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        setNewArrivals((prev) => [...prev, ...newArrivalsData]);
        setNewArrivalsAll((prev) => [...prev, ...newArrivalsData]);
        setNewArrivalsLastDoc(
          newArrivalsSnapshot.docs[newArrivalsSnapshot.docs.length - 1]
        );
      }

      if (type === "topSellings" && topSellingsLastDoc) {
        const topSellingsQuery = query(
          productsRef,
          startAfter(topSellingsLastDoc),
          limit(4)
        );
        const topSellingsSnapshot = await getDocs(topSellingsQuery);
        const topSellingsData = topSellingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        setTopSellings((prev) => [...prev, ...topSellingsData]);
        setTopSellingsAll((prev) => [...prev, ...topSellingsData]);
        setTopSellingsLastDoc(
          topSellingsSnapshot.docs[topSellingsSnapshot.docs.length - 1]
        );
      }
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

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
            <div className="flex flex-wrap items-center justify-between gap-6">
              {(showAllNewArrivals ? newArrivalsAll : newArrivals).map(
                (item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col items-start justify-center gap-3 ${satoshi.className}`}
                  >
                    <Link
                      href={`/details/${item.id}`}
                      className="cursor-pointer"
                    >
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
                )
              )}
            </div>
            {!showAllNewArrivals && newArrivalsLastDoc && (
              <div>
                <button
                  onClick={() => {
                    fetchMoreProducts("newArrivals");
                    setShowAllNewArrivals(true);
                  }}
                  className={` ${satoshi.className} btn border-spacing-1 border-gray-200 rounded-3xl w-[218px] h-[52px] text-base leading-[21px] font-500`}
                >
                  {loadingMore ? "Loading..." : "View All"}
                </button>
              </div>
            )}
            {showAllNewArrivals && (
              <div>
                <button
                  onClick={() => {
                    setShowAllNewArrivals(false);
                    setNewArrivals(newArrivals.slice(0, 4)); // Reset to initial state
                  }}
                  className={` ${satoshi.className} btn border-spacing-1 border-gray-200 rounded-3xl w-[218px] h-[52px] text-base leading-[21px] font-500`}
                >
                  Hide
                </button>
              </div>
            )}
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
            <div className="flex flex-wrap items-center justify-between gap-6">
              {(showAllTopSellings ? topSellingsAll : topSellings).map(
                (item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col items-start justify-center gap-3 ${satoshi.className}`}
                  >
                    <Link
                      href={`/details/${item.id}`}
                      className="cursor-pointer"
                    >
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
                )
              )}
            </div>
            {!showAllTopSellings && topSellingsLastDoc && (
              <div>
                <button
                  onClick={() => {
                    fetchMoreProducts("topSellings");
                    setShowAllTopSellings(true);
                  }}
                  className={` ${satoshi.className} btn border-spacing-1 border-gray-200 rounded-3xl w-[218px] h-[52px] text-base leading-[21px] font-500`}
                >
                  {loadingMore ? "Loading..." : "View All"}
                </button>
              </div>
            )}
            {showAllTopSellings && (
              <div>
                <button
                  onClick={() => {
                    setShowAllTopSellings(false);
                    setTopSellings(topSellings.slice(0, 4)); // Reset to initial state
                  }}
                  className={` ${satoshi.className} btn border-spacing-1 border-gray-200 rounded-3xl w-[218px] h-[52px] text-base leading-[21px] font-500`}
                >
                  Hide
                </button>
              </div>
            )}
          </div>
          <hr />
        </div>
      </section>
    </>
  );
}

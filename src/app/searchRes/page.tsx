"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import localFont from "next/font/local";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/farebase/config";
import Link from "next/link";

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

export default function SearchResults() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, "products");
        const querySnapshot = await getDocs(productsRef);
        const fetchedProducts: Product[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        setProducts(fetchedProducts);
      } catch (err) {
        setError("Error fetching products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (queryParam) {
      const lowerCaseQuery = queryParam.toLowerCase();
      const result = products.filter((product) =>
        product.name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredProducts(result);
    } else {
      setFilteredProducts(products);
    }
  }, [queryParam, products]);

  return (
    <div className="container mx-auto p-4">
      <h1 className={`text-3xl font-bold mb-4 ${integralCF.className}`}>
        Search Results for "{queryParam}"
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-xl text-red-600">{error}</p>
      ) : filteredProducts.length > 0 ? (
        <div className="flex flex-wrap justify-between gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`flex flex-col items-start justify-center gap-3 ${satoshi.className} w-[290px]`}
            >
              <Link href={`/details/${product.id}`} className="cursor-pointer">
                <Image
                  src={product.photo[0] || "/placeholder.png"}
                  alt={product.name}
                  width={290}
                  height={294}
                  className="h-72 object-cover"
                />
              </Link>
              <h4 className="text-[20px] leading-[27px] font-bold text-black">
                {product.name}
              </h4>
              <div className="flex items-center justify-between w-full">
                <div className="rating flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <input
                      key={star}
                      type="radio"
                      name={`rating-${product.id}`}
                      className="mask mask-star-2 bg-orange-400"
                      defaultChecked={product.rating >= star}
                      readOnly
                    />
                  ))}
                </div>
                <p className="text-black">
                  {product.rating}/<span className="text-gray-600">5</span>
                </p>
              </div>
              <h3 className="text-[24px] leading-[37px] font-bold">
                ${product.price}
              </h3>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl text-gray-600">No products found</p>
      )}
    </div>
  );
}

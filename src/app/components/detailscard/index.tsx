"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import localFont from "next/font/local";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  limit,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/farebase/config";
import { useRouter } from "next/navigation";
import { message } from "antd";

const integralCF = localFont({
  src: "../../../fonts/IntegralCF/IntegralCF-Bold.ttf",
  display: "swap",
});

const satoshi = localFont({
  src: "../../../fonts/satoshi/Satoshi-Variable.ttf",
  display: "swap",
});

interface Product {
  id: string;
  name: string;
  photo: string[];
  price: number;
  rating: number;
  description: string;
}

interface DetailsCarsProps {
  id: string;
}

const DetailsCars: React.FC<DetailsCarsProps> = ({ id }) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("red");
  const [selectedSize, setSelectedSize] = useState("small");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    const fetchRelatedProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const productsQuery = query(productsCollection, limit(4));
        const querySnapshot = await getDocs(productsQuery);
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setRelatedProducts(products);
      } catch (error) {
        console.error("Error getting related products:", error);
      }
    };

    fetchProduct();
    fetchRelatedProducts();
  }, [id]);

  const handleQuantityChange = (operation: "decrease" | "increase") => {
    setQuantity((prev) => {
      if (operation === "decrease" && prev > 1) return prev - 1;
      if (operation === "increase") return prev + 1;
      return prev;
    });
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      message.error("Please sign up to add items to your cart.");
      router.push("/signup");
      return;
    }

    const cartItem = {
      id: product!.id,
      name: product!.name,
      photo: product!.photo[0],
      price: product!.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
    };

    try {
      const cartRef = doc(db, "cart", "Sq9hZ7Mo4guHBgvkeuMC");

      await updateDoc(cartRef, {
        items: arrayUnion(cartItem),
      });
      message.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      message.error("Error adding item to cart. Please try again.");
    }
  };

  if (!product) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-16">
      <section className="flex flex-col items-center justify-center">
        <div className="w-full p-8 bg-white shadow-md rounded-lg">
          <Link
            href="/"
            className={`text-white mb-4 inline-block text-lg bg-slate-900 p-4 rounded-3xl ${satoshi.className} `}
          >
            &larr; Back to Home
          </Link>
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="md:w-1/2">
              <Image
                src={product.photo[0]}
                alt={product.name}
                className="mb-4 rounded-lg"
                width={400}
                height={400}
              />
            </div>
            <div className="md:w-1/2 flex flex-col items-start gap-5 ">
              <h1 className={`text-4xl font-bold mb-4 ${integralCF.className}`}>
                {product.name}
              </h1>
              <div className="flex items-center mb-6">
                <span className="text-yellow-500 text-2xl mr-2">
                  {Array.from({ length: Math.floor(product.rating) }).map(
                    (_, index) => (
                      <span key={index} className="text-yellow-500">
                        ★
                      </span>
                    )
                  )}
                  {product.rating % 1 >= 0.5 && (
                    <span className="text-yellow-500">★</span>
                  )}
                  {Array.from({ length: 5 - Math.ceil(product.rating) }).map(
                    (_, index) => (
                      <span key={index} className="text-gray-300">
                        ★
                      </span>
                    )
                  )}
                </span>
                <span className="text-lg text-gray-600">
                  ({product.rating})/5
                </span>
              </div>
              <p
                className={`mb-4 ${satoshi.className} text-[32px] leading-[43px] font-bold`}
              >
                ${product.price}
              </p>
              <p
                className={`mb-6 text-base leading-6 text-neutral-400 ${satoshi.className}`}
              >
                {product.description}
              </p>

              <div className="flex gap-4 mb-6">
                {["red", "green", "blue"].map((color) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xl font-bold cursor-pointer ${
                      color === selectedColor ? "ring-2 ring-black" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color === selectedColor && "✔"}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mb-6">
                {["Small", "Medium", "Large", "X-Large"].map((size) => (
                  <button
                    key={size}
                    className={`w-[100px] h-[46px] px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-base ${
                      size === selectedSize ? "bg-green-500 text-white" : ""
                    } active:bg-black active:text-white`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex w-[170px] h-[52px] gap-2 bg-slate-300 rounded-3xl p-3 items-center justify-between">
                  <button
                    className="px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 text-2xl"
                    onClick={() => handleQuantityChange("decrease")}
                  >
                    -
                  </button>
                  <span className="text-lg font-bold">{quantity}</span>
                  <button
                    className="px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 text-2xl"
                    onClick={() => handleQuantityChange("increase")}
                  >
                    +
                  </button>
                </div>
                <button
                  className="w-[400px] h-[52px] px-4 py-2 bg-black rounded-3xl text-white text-sm hover:bg-white hover:text-black border-black border-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-24">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-11 mb-20">
            <h1
              className={`${integralCF.className} text-black font-700 text-center text-5xl`}
            >
              You might also like
            </h1>

            <div className="flex flex-wrap items-center  rounded-xl gap-6">
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  className="w-[364px] h-[550px] relative shadow-md rounded-lg"
                >
                  <div className="relative">
                    <Image
                      src={item.photo[0]}
                      alt={item.name}
                      width={364}
                      height={400}
                      className="rounded-t-lg w-[364px] h-[400px]"
                    />
                    <div className="absolute bottom-2 left-2 bg-white px-2 py-1 ">
                      <span className="text-lg text-black">${item.price}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-b-lg">
                    <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                    <div className="flex items-center mb-4">
                      <span className="text-yellow-500 text-xl mr-1">
                        {Array.from({ length: Math.floor(item.rating) }).map(
                          (_, index) => (
                            <span key={index} className="text-yellow-500">
                              ★
                            </span>
                          )
                        )}
                        {item.rating % 1 >= 0.5 && (
                          <span className="text-yellow-500">★</span>
                        )}
                        {Array.from({
                          length: 5 - Math.ceil(item.rating),
                        }).map((_, index) => (
                          <span key={index} className="text-gray-300">
                            ★
                          </span>
                        ))}
                      </span>
                      <span className="text-lg text-gray-600">
                        ({item.rating})/5
                      </span>
                    </div>
                    <Link
                      href={`/details/${item.id}`}
                      className="text-white bg-slate-900 px-3 py-2 rounded-full hover:bg-gray-800"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DetailsCars;

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
import { getAuth } from "firebase/auth";
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
  sizes: string[];
}

interface DetailsCarsProps {
  id: string;
}

const DetailsCars: React.FC<DetailsCarsProps> = ({ id }) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("red");
  const [selectedSize, setSelectedSize] = useState("Small");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({
            id: docSnap.id,
            name: data.name,
            photo: data.photo || [],
            price: data.price,
            rating: data.rating,
            description: data.description,
            sizes: data.sizes || [],
          } as Product);
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
    if (!user) {
      message.error("Please sign up or log in to add items to your cart.");
      router.push("/signup");
      return;
    }

    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      photo: product.photo[0],
      price: product.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
    };

    try {
      const cartRef = doc(db, "cart", user.uid);
      const cartSnap = await getDoc(cartRef);
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
            className={`text-white mb-4 inline-block text-lg bg-slate-900 p-4 rounded-3xl ${satoshi.className}`}
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
            <div className="md:w-1/2 flex flex-col items-start gap-5">
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
                className={`mb-6 text-lg leading-6 text-neutral-500 ${satoshi.className}`}
              >
                {product.description}
              </p>

              <div className="flex gap-4 mb-6">
                {["red", "green", "blue", "yellow", "black", "white"].map(
                  (color) => (
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
                  )
                )}
              </div>
              <div className="flex gap-4 mb-6">
                {["Small", "Medium", "Large", "X-Large"].map((size) => (
                  <button
                    key={size}
                    className={`w-[100px] h-[46px] px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-base ${
                      size === selectedSize ? "bg-blue-500 text-white" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="flex items-center mb-6">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  -
                </button>
                <span className="mx-4 text-xl">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        <div className="w-full mt-8">
          <h2 className={`text-3xl font-bold mb-4 ${integralCF.className}`}>
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="p-4 bg-white shadow-md rounded-lg"
              >
                <Image
                  src={relatedProduct.photo[0]}
                  alt={relatedProduct.name}
                  className="mb-4 rounded-lg"
                  width={200}
                  height={200}
                />
                <h3
                  className={`text-xl font-bold mb-2 ${integralCF.className}`}
                >
                  {relatedProduct.name}
                </h3>
                <p
                  className={`mb-2 ${satoshi.className} text-[20px] leading-[27px] font-bold`}
                >
                  ${relatedProduct.price}
                </p>
                <Link
                  href={`/product/${relatedProduct.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DetailsCars;

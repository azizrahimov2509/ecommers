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
  arrayRemove,
  setDoc,
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

interface CartItem {
  id: string;
  name: string;
  photo: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
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

    // Создание уникального идентификатора для каждого варианта товара
    const variantId = `${product.id}_${selectedColor}_${selectedSize}`;

    const cartItem = {
      id: variantId, // Используем уникальный идентификатор
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
      if (cartSnap.exists()) {
        const currentItems = cartSnap.data().items || [];

        // Проверка, есть ли уже такой же вариант в корзине
        const existingItem = currentItems.find(
          (item: CartItem) =>
            item.id === cartItem.id &&
            item.color === cartItem.color &&
            item.size === cartItem.size
        );

        if (existingItem) {
          // Если товар уже в корзине, обновляем количество
          const updatedItems = currentItems.map((item: CartItem) =>
            item.id === cartItem.id &&
            item.color === cartItem.color &&
            item.size === cartItem.size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          await updateDoc(cartRef, { items: updatedItems });
        } else {
          // Если товар отсутствует, добавляем его
          await updateDoc(cartRef, {
            items: arrayUnion(cartItem),
          });
        }
      } else {
        // Если корзина пуста, создаем ее с первым товаром
        await setDoc(cartRef, { items: [cartItem] });
      }
      message.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      message.error("Error adding item to cart. Please try again.");
    }
  };

  const handleRemoveFromCart = async (variantId: string) => {
    if (!user) return;

    try {
      const cartRef = doc(db, "cart", user.uid);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        const currentItems = cartSnap.data().items || [];
        const updatedItems = currentItems.filter(
          (item: CartItem) => item.id !== variantId
        );
        await updateDoc(cartRef, { items: updatedItems });
        message.success("Item removed from cart!");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      message.error("Error removing item from cart. Please try again.");
    }
  };

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, index) => (
          <span key={index} className="text-yellow-500 text-2xl">
            ★
          </span>
        ))}
        {halfStar && <span className="text-yellow-500 text-2xl">☆</span>}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={index} className="text-gray-300 text-2xl">
            ★
          </span>
        ))}
      </div>
    );
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
                {renderRatingStars(product.rating)}
                <span className="text-lg text-gray-600 ml-2">
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
                    className={`w-[100px] h-[46px] px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-[blue] hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 text-base ${
                      size === selectedSize ? "bg-[blue] text-white" : ""
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
                className="w-full py-3btn  btn-primary mt-4"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden flex flex-col items-start justify-between gap-2 hover:shadow-xl rounded-xl pb-4"
              >
                <Link href={`/details/${item.id}`} className="cursor-pointer">
                  <Image
                    src={item.photo[0] || "/placeholder.png"}
                    alt={item.name}
                    width={290}
                    height={294}
                    className="h-72"
                  />
                  <div className="pl-4 flex flex-col items-start justify-between gap-4">
                    <h4 className="text-[20px] leading-[27px] font-bold text-black">
                      {item.name}
                    </h4>
                    <div className="flex items-center ">
                      <div className="rating pr-2">
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

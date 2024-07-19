"use client";

import React, { useEffect, useState } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/farebase/config";
import Image from "next/image";
import { message } from "antd";

interface CartItem {
  id: string;
  name: string;
  photo: string;
  price: number;
  quantity: number;
  color: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user) {
        message.error("Please sign in to view your cart.");
        return;
      }

      try {
        const cartRef = doc(db, "cart", "Sq9hZ7Mo4guHBgvkeuMC");
        const cartSnap = await getDoc(cartRef);

        if (cartSnap.exists()) {
          const cartData = cartSnap.data();
          setCartItems(cartData.items || []);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        message.error("Error fetching cart items. Please try again.");
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotal(total);
    };

    calculateTotal();
  }, [cartItems]);

  if (!cartItems.length) {
    return <div className="container">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
      <div className="flex flex-col gap-8">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-8 p-4 bg-white shadow-md rounded-lg"
          >
            <Image
              src={item.photo}
              alt={item.name}
              width={150}
              height={150}
              className="rounded-lg"
            />
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl font-bold">{item.name}</h2>
              <p className="text-lg text-gray-600">Color: {item.color}</p>
              <p className="text-lg text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-xl font-bold">${item.price}</p>
            </div>
          </div>
        ))}
        <div className="text-right">
          <h2 className="text-2xl font-bold">Total: ${total}</h2>
        </div>
      </div>
    </div>
  );
};

export default Cart;

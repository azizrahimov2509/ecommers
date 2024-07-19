"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [loading, setLoading] = useState(false);

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
  }, [setCartItems]);

  useEffect(() => {
    const calculateTotals = () => {
      const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setSubtotal(subtotal);

      const discount = subtotal * 0.2;
      setDiscount(discount);

      const deliveryFee = 10;
      setDeliveryFee(deliveryFee);

      const total = subtotal - discount + deliveryFee;
      setTotal(total);
    };

    calculateTotals();
  }, [cartItems]);

  useEffect(() => {
    const updateFirestore = async () => {
      if (cartItems.length === 0) return;

      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user) {
          message.error("Please sign in to update your cart.");
          return;
        }

        const cartRef = doc(db, "cart", "Sq9hZ7Mo4guHBgvkeuMC");
        await updateDoc(cartRef, { items: cartItems });
      } catch (error) {
        console.error("Error updating cart in Firestore:", error);
        message.error("Error updating cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    updateFirestore();
  }, [cartItems]);

  const handleQuantityChange = (
    itemId: string,
    operation: "decrease" | "increase"
  ) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId) {
          const newQuantity =
            operation === "decrease"
              ? Math.max(1, item.quantity - 1)
              : item.quantity + 1;
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!cartItems.length) {
    return <div className="container mx-auto p-4">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <h1 className="text-4xl font-bold mb-8">YOUR CART</h1>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border p-4 rounded-lg"
              >
                <Image
                  src={item.photo}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="object-cover"
                />
                <div className="flex-grow px-4">
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <p>Color: {item.color}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">${item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex w-[170px] h-[52px] gap-2 bg-slate-300 rounded-3xl p-3 items-center justify-between">
                    <button
                      className="px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 text-2xl"
                      onClick={() => handleQuantityChange(item.id, "decrease")}
                    >
                      -
                    </button>
                    <span className="text-lg font-bold">{item.quantity}</span>
                    <button
                      className="px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 text-2xl"
                      onClick={() => handleQuantityChange(item.id, "increase")}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-circle btn-outline btn-error"
                    onClick={() => removeItem(item.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/4">
          <div className="border p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount (-20%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Add promo code"
                className="input input-bordered w-full"
              />
              <button className="btn btn-primary w-full mt-2">Apply</button>
            </div>
            <button className="btn btn-block btn-primary mt-4">
              Go to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

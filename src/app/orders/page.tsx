"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/farebase/config"; // Ensure the path is correct
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { message } from "antd";
import loader from "../../../public/loader.gif";
import Image from "next/image";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchOrders(currentUser);
      } else {
        setLoading(false);
        message.error("Please log in to view your orders.");
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, [auth]);

  const fetchOrders = async (currentUser: any) => {
    try {
      const ordersRef = collection(db, "orders");
      const querySnapshot = await getDocs(ordersRef);

      const userOrders = querySnapshot.docs
        .filter((doc) => doc.data().userId === currentUser.uid)
        .map((doc) => ({ id: doc.id, ...doc.data() }));

      setOrders(userOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Error fetching orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
      message.success("Order canceled successfully.");
    } catch (error) {
      console.error("Error canceling order:", error);
      message.error("Error canceling order. Please try again.");
    }
  };

  const calculateOrderTotal = (cart: any[]) => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity; // Assuming each item has a `price` and `quantity`
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center container mx-auto p-4">
        <Image src={loader} alt="loader" />
      </div>
    ); // Add a loading state if necessary
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p>You have no completed orders.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 my-2 rounded shadow-lg">
              <h2 className="text-xl">{order.displayName}</h2>
              <p>Phone: {order.phoneNumber}</p>
              <p>Total: ${calculateOrderTotal(order.cart).toFixed(2)}</p>{" "}
              {/* Use the calculated total */}
              <p>Items:</p>
              <ul>
                {order.cart.map((item: any) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Image
                        src={item.photo}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="mr-2"
                      />
                      <span>
                        {item.name} x {item.quantity} quantity
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => cancelOrder(order.id)}
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded"
              >
                Cancel Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

"use client";
import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  collection,
  getDocs, // Add this line
} from "firebase/firestore";
import { db } from "@/farebase/config";
import Image from "next/image";
import { message, Modal } from "antd";
import loader from "../../../public/loader.gif";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import localFont from "next/font/local";

const satoshi = localFont({
  src: "../../fonts/satoshi/Satoshi-Variable.ttf",
  display: "swap",
});

interface CartItem {
  id: string;
  name: string;
  photo: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [purchasingItems, setPurchasingItems] = useState<string[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: currentUser.uid,
            displayName: currentUser.displayName || "",
            email: currentUser.email || "",
          })
        );
        setUser(currentUser);
      } else {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (storedUser) {
          setUser(storedUser);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!user) return;

    const fetchCartItems = async () => {
      try {
        const cartRef = doc(db, "cart", user.uid);
        const cartSnap = await getDoc(cartRef);
        setCartItems(cartSnap.exists() ? cartSnap.data().items || [] : []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        message.error("Error fetching cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  useEffect(() => {
    const calculateTotals = () => {
      const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setSubtotal(subtotal);

      const discount = subtotal * 0.2; // 20% discount
      setDiscount(discount);

      const deliveryFee = 10; // Fixed delivery fee
      setDeliveryFee(deliveryFee);

      const total = subtotal - discount + deliveryFee;
      setTotal(total);
    };

    calculateTotals();
  }, [cartItems]);

  useEffect(() => {
    const updateFirestore = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const cartRef = doc(db, "cart", user.uid);
        const cartSnap = await getDoc(cartRef);

        if (!cartSnap.exists()) {
          await setDoc(cartRef, { items: cartItems });
        } else {
          await updateDoc(cartRef, { items: cartItems });
        }
      } catch (error) {
        console.error("Error updating cart in Firestore:", error);
        message.error("Error updating cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    updateFirestore();
  }, [cartItems, user]);

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

  const handleCheckout = () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (storedUser) {
      setUserData({
        name: storedUser.displayName || "Unknown",
        email: storedUser.email || "Unknown",
        phone: storedUser.phoneNumber || "Unknown",
      });

      // Mark the items as purchasing
      setPurchasingItems(cartItems.map((item) => item.id));
    } else {
      message.error("User details are missing. Please log in again.");
      return;
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const submitOrder = async () => {
    if (!user) {
      message.error("User not found.");
      return;
    }

    try {
      // Fetch user details from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        message.error("User details not found. Please try again.");
        return;
      }

      const userDetails = userDoc.data();
      const orderData = {
        userId: user.uid,
        displayName: userDetails.displayName || "Unknown",
        phoneNumber: userDetails.phoneNumber || "Unknown",
        cart: cartItems,
        timestamp: new Date(),
      };

      // Store the user details in userData state to display in the modal
      setUserData({
        name: userDetails.displayName || "Unknown",
        email: userDetails.email || "Unknown",
        phone: userDetails.phoneNumber || "Unknown", // Fetch phone number
      });

      // Add the order and store the order ID
      const orderDocRef = await addDoc(collection(db, "orders"), orderData);
      setOrderId(orderDocRef.id); // Only set the order ID here
      message.success("С вами свяжется администратор. Наш номер: +123456789");

      // Clear purchasing items after a delay (optional)
      setTimeout(() => {
        setPurchasingItems([]);
      }, 3000); // Adjust the time as needed

      handleModalClose();
    } catch (error) {
      console.error("Error submitting order:", error);
      message.error("Error submitting order. Please try again.");
    }
  };

  // Function to cancel the order
  const cancelOrder = async () => {
    if (!orderId) {
      message.error("No order ID found.");
      return;
    }

    try {
      await deleteDoc(doc(db, "orders", orderId)); // Delete the order from Firestore
      setOrderId(null); // Reset order ID
      message.success("Order canceled successfully.");
    } catch (error) {
      console.error("Error canceling order:", error);
      message.error("Error canceling order. Please try again.");
    }
  };

  useEffect(() => {
    if (user) {
      const fetchOrderId = async () => {
        const ordersRef = collection(db, "orders");
        const querySnapshot = await getDocs(ordersRef);
        querySnapshot.forEach((doc) => {
          const orderData = doc.data();
          if (orderData.userId === user.uid) {
            setOrderId(doc.id); // Set order ID if found
          }
        });
      };

      fetchOrderId();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center container mx-auto p-4">
        <Image src={loader} alt="loader" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center text-xl text-red-600">
        Please sign in to view your cart.
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="container mx-auto p-4 text-center text-xl text-red-600">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className={`text-3xl font-bold ${satoshi.className}`}>Your Cart</h1>
      <div className="flex flex-wrap mt-4 space-y-4 gap-2">
        <div className="bg-white rounded-lg shadow-lg ">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border p-4 rounded-lg shadow-lg"
            >
              <Image
                src={item.photo}
                alt={item.name}
                width={96}
                height={96}
                className="object-cover"
              />
              <div className={`flex-grow px-4 ${satoshi.className}`}>
                <h2 className="text-xl font-bold">{item.name}</h2>
                {purchasingItems.includes(item.id) && (
                  <span className="text-sm text-yellow-600 font-semibold">
                    Purchasing...
                  </span>
                )}
                <p className="font-bold">
                  Color: <span className="font-medium">{item.color}</span>{" "}
                  <span
                    className="p-1 w-4 h-4 rounded-full inline-block"
                    style={{ backgroundColor: item.color }}
                  ></span>
                </p>
                <p className="font-bold">
                  Size: <span className="font-medium">{item.size}</span>
                </p>
                <p className="font-bold">
                  Quantity: <span className="font-medium">{item.quantity}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  <span className="font-medium">${item.price}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex w-[170px] h-[52px] gap-2 bg-slate-300 rounded-3xl p-3 items-center ml-3 justify-between">
                  <button
                    className="px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 text-2xl"
                    onClick={() => handleQuantityChange(item.id, "decrease")}
                  >
                    -
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    className="px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 text-2xl"
                    onClick={() => handleQuantityChange(item.id, "increase")}
                  >
                    +
                  </button>
                </div>
                <button
                  className="btn btn-outline btn-error"
                  onClick={() => removeItem(item.id)}
                >
                  Delete All
                </button>
              </div>
              {/* Cancel Order Button inside the cart item */}
              {orderId && cartItems.length > 0 && (
  <div className="ml-3">
    <button
      onClick={cancelOrder}
      className="bg-red-500 text-white p-3 rounded hover:bg-red-600 transition "
    >
      Cancel Order
    </button>
  </div>
)}
            </div>
          ))}
        </div>
        <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <p className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Discount:</span>
            <span>-${discount.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </p>
          <div className="border-t my-4" />
          <p className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </p>
          <button
            className="btn btn-primary w-full mt-4"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>

      <Modal
        title="Confirm Your Order"
        open={showModal}
        onCancel={handleModalClose}
        footer={null}
      >
        <div className={satoshi.className}>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>Phone: {userData.phone}</p>
          <p>Total: ${total.toFixed(2)}</p>
          <div className="flex justify-end">
            <button
              onClick={submitOrder}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;

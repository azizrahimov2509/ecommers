// src/components/Cart.tsx
import React from "react";

const Cart: React.FC = () => {
  const items = [
    {
      id: 1,
      name: "Gradient Graphic T-shirt",
      size: "Large",
      color: "White",
      price: 145,
      image: "/images/tshirt.png",
    },
    {
      id: 2,
      name: "Checkered Shirt",
      size: "Medium",
      color: "Red",
      price: 180,
      image: "/images/shirt.png",
    },
    {
      id: 3,
      name: "Skinny Fit Jeans",
      size: "Large",
      color: "Blue",
      price: 240,
      image: "/images/jeans.png",
    },
  ];

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const discount = subtotal * 0.2;
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <h1 className="text-4xl font-bold mb-8">YOUR CART</h1>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border p-4 rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover"
                />
                <div className="flex-grow px-4">
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <p>Size: {item.size}</p>
                  <p>Color: {item.color}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">${item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn btn-circle">-</button>
                  <span className="text-lg">1</span>
                  <button className="btn btn-circle">+</button>
                  <button className="btn btn-circle btn-outline btn-error">
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
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount (-20%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee}</span>
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

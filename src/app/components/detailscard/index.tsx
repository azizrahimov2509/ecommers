"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import localFont from "next/font/local";

import tshirtwithdetails from "../../../../public/Frame 32.png";
import skinnyjeans from "../../../../public/Frame 33.png";
import checkeredshirt from "../../../../public/Frame 34.png";
import SLEEVESTRIPEDTSHIRT from "../../../../public/Frame 38.png";
import frame39 from "../../../../public/Frame 39.png";
import frame40 from "../../../../public/Frame 40.png";
import frame41 from "../../../../public/Frame 41.png";
import frame42 from "../../../../public/Frame 42.png";
import { notFound } from "next/navigation";

const products = [
  {
    id: "1",
    name: "T-SHIRT WITH TAPE DETAILS",
    description: "This T-shirt features stylish tape details.",
    price: 120,
    image: tshirtwithdetails,
    rating: 4.5,
  },
  {
    id: "2",
    name: "SKINNY FIT JEANS",
    description: "These jeans offer a comfortable skinny fit.",
    price: 240,
    image: skinnyjeans,
    rating: 4.2,
  },
  {
    id: "3",
    name: "CHECKERED SHIRT",
    description: "A classic checkered shirt for all occasions.",
    price: 180,
    image: checkeredshirt,
    rating: 4.8,
  },
  {
    id: "4",
    name: "SLEEVE STRIPED T-SHIRT",
    description: "A T-shirt with stylish sleeve stripes.",
    price: 130,
    image: SLEEVESTRIPEDTSHIRT,
    rating: 4.3,
  },
  {
    id: "5",
    name: "VERTICAL STRIPED SHIRT",
    description: "A vertical striped shirt for a sharp look.",
    price: 212,
    image: frame39,
    rating: 4.7,
  },
  {
    id: "6",
    name: "COURAGE GRAPHIC T-SHIRT",
    description: "A T-shirt featuring a bold graphic design.",
    price: 145,
    image: frame40,
    rating: 4.6,
  },
  {
    id: "7",
    name: "LOOSE FIT BERMUDA SHORTS",
    description: "Comfortable and loose fit Bermuda shorts.",
    price: 80,
    image: frame41,
    rating: 4.1,
  },
  {
    id: "8",
    name: "FADED SKINNY JEANS",
    description: "Stylish faded skinny jeans for everyday wear.",
    price: 210,
    image: frame42,
    rating: 4.4,
  },
];

const integralCF = localFont({
  src: "../../../fonts/IntegralCF/IntegralCF-Bold.ttf",
  display: "swap",
});

const satoshi = localFont({
  src: "../../../fonts/satoshi/Satoshi-Variable.ttf",
  display: "swap",
});

interface DetailsCarsProps {
  id: string | number;
}

const DetailsCars: React.FC<DetailsCarsProps> = ({ id }) => {
  const product = products.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("red");

  if (!product) {
    notFound();
  }

  const handleQuantityChange = (operation: string) => {
    setQuantity((prev) => {
      if (operation === "decrease" && prev > 1) return prev - 1;
      if (operation === "increase") return prev + 1;
      return prev;
    });
  };

  return (
    <div className="container mx-auto py-16">
      <section className="flex flex-col items-center justify-center">
        <div className="w-[1100px] h-[700px] mx-auto p-8 bg-white shadow-md rounded-lg">
          <Link
            href="/"
            className={`text-white mb-4 inline-block text-lg bg-slate-900 p-4 rounded-3xl ${satoshi.className} `}
          >
            &larr; Back to Home
          </Link>
          <div className="flex items-start justify-between gap-24">
            <div>
              <Image
                src={product.image}
                alt={product.name}
                className="w-[444px] h-[450px] mb-4 rounded-lg"
                width={444}
                height={450}
              />
            </div>
            <div>
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
                className={`text-xl font-semibold mb-4 ${satoshi.className} text-[32px] leading-[43px] font-bold`}
              >
                ${product.price}
              </p>
              <p
                className={`mb-6 text-base leading-6 text-neutral-400 ${satoshi.className}`}
              >
                {product.description}
              </p>
              {/* Круглые цветные иконки */}
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
                    {color === selectedColor && "V"}
                  </div>
                ))}
              </div>
              {/* Кнопки для размеров */}
              <div className="flex gap-4 mb-6">
                {["Small", "Medium", "Large", "X-Large"].map((size) => (
                  <button
                    key={size}
                    className="w-[100px] h-[46px] px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-base active:bg-black active:text-white"
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex w-[170px] h-[52px]  gap-2 bg-slate-300 rounded-3xl p-3 items-center justify-between">
                  <button
                    className="px-3 py-1  text-gray-700  focus:outline-none focus:ring-2 focus:ring-gray-400 text-2xl"
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
                <button className=" w-[400px] h-[52px] px-4 py-2 bg-black rounded-3xl text-white text-sm hover:bg-white hover:text-black border-black border-2 focus:outline-none focus:ring-2 focus:ring-green-400">
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

            <div className="flex items-center justify-between gap-6">
              {products.slice(4).map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col items-start justify-center gap-3 ${satoshi.className}`}
                >
                  <Link href={`/details/${item.id}`} className="cursor-pointer">
                    <Image src={item.image} alt={item.name} />
                  </Link>
                  <h4 className=" text-[20px] leading-[27px] font-bold text-black">
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
              ))}
            </div>
            <div>
              <button
                className={` ${satoshi.className} btn border-spacing-1 border-gray-200 rounded-3xl w-[218px] h-[52px] text-base leading-[21px] font-500 `}
              >
                View All
              </button>
            </div>
          </div>
          <hr />
        </div>
      </section>

      <section className="">
        <div className="container">
          <div className="text-white bg-black rounded-3xl p-14 flex items-center justify-between gap-28">
            <h1
              className={`${integralCF.className} text-[40px] leading-[45px] font-700 `}
            >
              STAY UPTO DATE ABOUT OUR LATEST OFFERS
            </h1>

            <form className="flex flex-col gap-6 relative">
              <input
                type="email"
                placeholder="Enter your email address"
                className={`rounded-3xl p-4 w-[349px] h-[48px] ${satoshi.className} text-base text-black pl-8`}
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute top-3.5 left-3"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="black"
              >
                <path d="M2 3a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V3zm2-.5v4.943l6 3.499 6-3.499V2.5H4zm0 5.208V17.5h12V8.708l-6 3.5-6-3.5z" />
              </svg>
              <button
                className={`w-[349px] h-[48px] rounded-3xl bg-white border-e-2 border-black ${satoshi.className} text-black text-base  font-bold`}
              >
                Subscribe to Newsletter
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DetailsCars;

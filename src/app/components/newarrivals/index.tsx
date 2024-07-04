import React from "react";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import tshirtwithdetails from "../../../../public/Frame 32.png";
import skinnyjeans from "../../../../public/Frame 33.png";
import checkeredshirt from "../../../../public/Frame 34.png";
import SLEEVESTRIPEDTSHIRT from "../../../../public/Frame 38.png";
import frame39 from "../../../../public/Frame 39.png";
import frame40 from "../../../../public/Frame 40.png";
import frame41 from "../../../../public/Frame 41.png";
import frame42 from "../../../../public/Frame 42.png";

const integralCF = localFont({
  src: "../../../fonts/IntegralCF/IntegralCF-Bold.ttf",
  display: "swap",
});

const satoshi = localFont({
  src: "../../../fonts/satoshi/Satoshi-Variable.ttf",
  display: "swap",
});

const newArrivals = [
  {
    id: "1",
    name: "T-SHIRT WITH TAPE DETAILS",
    rating: 4.5,
    imgUrl: tshirtwithdetails,
    price: 120,
  },
  {
    id: "2",
    name: "SKINNY FIT JEANS",
    rating: 3.5,
    imgUrl: skinnyjeans,
    price: 240,
  },
  {
    id: "3",
    name: "CHECKERED SHIRT",
    rating: 4.5,
    imgUrl: checkeredshirt,
    price: 180,
  },
  {
    id: "4",
    name: "SLEEVE STRIPED T-SHIRT",
    rating: 4.5,
    imgUrl: SLEEVESTRIPEDTSHIRT,
    price: 130,
  },
];

const topSellings = [
  {
    id: "5",
    name: "VERTICAL STRIPED SHIRT",
    rating: 5,
    imgUrl: frame39,
    price: 212,
  },
  {
    id: "6",
    name: "COURAGE GRAPHIC T-SHIRT",
    rating: 4,
    imgUrl: frame40,
    price: 145,
  },
  {
    id: "7",
    name: "LOOSE FIT BERMUDA SHORTS",
    rating: 3,
    imgUrl: frame41,
    price: 80,
  },
  {
    id: "8",
    name: "FADED SKINNY JEANS",
    rating: 4.5,
    imgUrl: frame42,
    price: 210,
  },
];

export default function NewArrivals() {
  return (
    <>
      <section className="mt-24">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-11 mb-20">
            <h1
              className={`${integralCF.className} text-black font-700 text-center text-5xl`}
            >
              NEW ARRIVALS
            </h1>

            <div className="flex items-center justify-between gap-6">
              {newArrivals.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col items-start justify-center gap-3 ${satoshi.className}`}
                >
                  <Link href={`/details/${item.id}`} className="cursor-pointer">
                    <Image src={item.imgUrl} alt={item.name} />
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
      <section className="mt-24">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-11 mb-20">
            <h1
              className={`${integralCF.className} text-black font-700 text-center text-5xl`}
            >
              TOP SELLING
            </h1>

            <div className="flex items-center justify-between gap-6">
              {topSellings.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col items-start justify-center gap-3 ${satoshi.className}`}
                >
                  <Link href={`/details/${item.id}`} className="cursor-pointer">
                    <Image src={item.imgUrl} alt={item.name} />
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
        </div>
      </section>
    </>
  );
}

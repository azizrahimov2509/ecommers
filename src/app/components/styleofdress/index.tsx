import React from "react";
import localFont from "next/font/local";

import casual from "../../../../public/Frame 61.png";
import party from "../../../../public/Frame 64.png";
import formal from "../../../../public/Frame 62.png";
import gym from "../../../../public/Frame 63.png";
import Image from "next/image";

const integralCF = localFont({
  src: "../../../fonts/IntegralCF/IntegralCF-Bold.ttf",
  display: "swap",
});

const satoshi = localFont({
  src: "../../../fonts/satoshi/Satoshi-Variable.ttf",
  display: "swap",
});
export default function StyleDress() {
  return (
    <>
      <section className="mt-20 mb-20 ">
        <div className="container bg-[#F0F0F0] rounded-3xl">
          <div className="p-12">
            <h1
              className={`${integralCF.className} text-black font-700 text-center text-5xl mb-16`}
            >
              BROWSE BY DRESS STYLE
            </h1>
            <div className="flex flex-col items-center justify-between gap-5">
              <div className="flex gap-5">
                <Image src={casual} alt="casual" className="rounded-2xl" />
                <Image src={formal} alt="formal" className="rounded-2xl" />
              </div>
              <div className="flex gap-5">
                <Image src={party} alt="party" className="rounded-2xl" />
                <Image src={gym} alt="gym" className="rounded-2xl" />
              </div>
            </div>
          </div>
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
    </>
  );
}

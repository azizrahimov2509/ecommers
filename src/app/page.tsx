import Image from "next/image";
import img from "../../public/Rectangle 2.png";
import localFont from "next/font/local";
import versaci from "../../public/Vector (1).png";
import kelvin from "../../public/Vector.png";
import zara from "../../public/zara.png";
import gucci from "../../public/Gucci.png";
import prada from "../../public/Prada.png";
import NewArrivals from "./components/newarrivals";
import StyleDress from "./components/styleofdress";
import Details from "./details/page";

const integralCF = localFont({
  src: "../fonts/IntegralCF/IntegralCF-Bold.ttf",
  display: "swap",
});

const satoshi = localFont({
  src: "../fonts/satoshi/Satoshi-Variable.ttf",
  display: "swap",
});

export default function Home() {
  return (
    <>
      <section className="bg-[#F2F0F1] h-[645px] ">
        <div className="container">
          <div className="flex items-start justify-between">
            <div className="w-[577px] flex-col items-center justify-between mt-16  ">
              <h1
                className={`${integralCF.className} font-700  leading-[64px] text-[64px] text-black`}
              >
                FIND CLOTHES THAT MATCHES YOUR STYLE
              </h1>
              <p
                className={` ${satoshi.className} font-400 leading-[22px] mt-5 mb-5 `}
              >
                Browse through our diverse range of meticulously crafted
                garments, designed to bring out your individuality and cater to
                your sense of style.
              </p>
              <button
                className={` ${satoshi.className} leading-4 from-500 text-base btn bg-black w-52 h-12 rounded-3xl text-white`}
              >
                Shop Now
              </button>
              <div className="mt-4 flex items-center justify-between">
                <div className=" border-r-2 border-gray-400">
                  <p
                    className={`${satoshi.className} font-bold leading-[54px] text-5xl`}
                  >
                    200+
                  </p>
                  <span
                    className={`${satoshi.className} text-base leading-[22px] font-400 pr-4`}
                  >
                    International Brands
                  </span>
                </div>
                <div className=" border-r-2 border-gray-400 ">
                  <p
                    className={`${satoshi.className} font-bold leading-[54px] text-5xl`}
                  >
                    2,000+
                  </p>
                  <span
                    className={`${satoshi.className} text-base leading-[22px] font-400 pr-4`}
                  >
                    High-Quality Products
                  </span>
                </div>
                <div>
                  <p
                    className={`${satoshi.className} font-bold leading-[54px] text-5xl `}
                  >
                    30,000+
                  </p>
                  <span
                    className={`${satoshi.className} text-base leading-[22px] font-400`}
                  >
                    Happy Customers
                  </span>
                </div>
              </div>
              <div className="mt-28">
                <Image src={versaci} alt="dsfsafd" />{" "}
              </div>
            </div>

            <div className="relative">
              <div>
                <Image
                  src={img}
                  alt="dsfsafd"
                  width={630}
                  height={645}
                  className="h-[645px] "
                />
              </div>

              <div className="absolute bottom-0 right-14">
                <Image src={kelvin} alt="kelvin" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black p-12">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-between gap-[130px]">
            <Image src={zara} alt="zara" />
            <Image src={gucci} alt="gucci" />
            <Image src={prada} alt="prada" />
          </div>
        </div>
      </section>

      <Details />
    </>
  );
}

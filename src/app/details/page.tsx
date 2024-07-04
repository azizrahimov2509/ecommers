import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="container">
      <div>
        <h1>Services</h1>
        <div className="cards">
          <Link href={"/details/product-1"}>Service-1</Link>
        </div>
        <div className="cards">
          <Link href={"/details/product-2"}>Service-2</Link>
        </div>
        <div className="cards">
          <Link href={"/details/product-3"}>Service-3</Link>
        </div>
      </div>
    </div>
  );
}

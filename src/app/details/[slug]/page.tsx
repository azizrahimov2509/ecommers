import React from "react";

export async function generateStaticParams() {
  const products = ["product-1", "product-2", "product-3"];
  return products.map((product) => ({
    slug: product,
  }));
}

export default function page({ params }: { params: { slug: string } }) {
  return (
    <div className="container">
      <section className="flex items-center justify-center">
        <div className="card">
          <h1>{params.slug}</h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere
            ullam saepe eligendi distinctio excepturi, doloremque culpa
            dignissimos iste voluptates alias.
          </p>
        </div>
      </section>
    </div>
  );
}

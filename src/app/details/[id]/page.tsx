import DetailsCars from "@/app/components/detailscard";
import React from "react";

interface ProductDetailProps {
  params: {
    id: string | number;
  };
}

export default function Page({ params }: ProductDetailProps) {
  return <DetailsCars id={params.id} />;
}

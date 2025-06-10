"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MerchList from "./merch-list";
import Shopify from "../lib/shopify";
import Footer from "../components/footer";
import "./merch.css";
import "./merch-list-item.css";
import "./merch-item-modal.css";

export default function Merch() {
  const [products, setProducts] = useState({ results: [], hasMore: false });

  useEffect(() => {
    Shopify.getProducts().then((products) => setProducts(products as any));
  }, []);

  return (
    <div className="merch">
      <Link href="/" className="logo">
        <Image
          src={`/hand-small-green.png`}
          alt="GODHANDUSA"
          width={327}
          height={378}
        />
      </Link>
      <MerchList products={products?.results || []} />
      <Footer />
    </div>
  );
}

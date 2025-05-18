"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import SVG from "react-inlinesvg";
import { Product } from "../utils";
import GlitchText from "../components/glitch-text";
import "./merch-list-item.css";

export default function MerchListItem(props: {
  index: number;
  product: Product;
  onClick: () => void;
}) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    const timeout = timeoutRef.current;

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  });

  const onClick = () => {
    const event = new CustomEvent("showstatic");
    document.dispatchEvent(event);

    timeoutRef.current = setTimeout(() => {
      const event = new CustomEvent("hidestatic");
      document.dispatchEvent(event);
      props.onClick();
    }, 100);
  };

  const price = () => {
    return Number(props.product.price).toFixed(2);
  };

  return (
    <div
      className="merchListItem"
      onClick={onClick}
      onPointerEnter={() => setTimestamp(Date.now())}
    >
      <div className="merchListItemHeader">
        <div className="title">
          <GlitchText
            label={`[ITEM_${`${props.index}`.padStart(2, "0")}] ${
              props.product.title
            }`}
            key={timestamp}
          />
        </div>
        <div className="status">
          <SVG src={`/solid-cellular-signal-3.svg`} width={16} height={16} />
        </div>
      </div>
      <div className="merchListItemImage">
        <Image src={props.product.images[0]} alt="" width={447} height={559} />
      </div>
      <div className="merchListItemFooter">
        <div className="price">${price()}</div>
        <div className="buy">
          <GlitchText label="Buy" key={timestamp} />
        </div>
      </div>
    </div>
  );
}

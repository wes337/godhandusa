"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import SVG from "react-inlinesvg";
import { Product } from "../utils";
import "./merch-list-item.css";

export default function MerchListItem(props: {
  index: number;
  product: Product;
  onClick: () => void;
}) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <div className="merchListItem" onClick={onClick}>
      <div className="merchListItemHeader">
        <div className="title">
          [ITEM_{`${props.index}`.padStart(2, "0")}] {props.product.title}
        </div>
        <div className="status">
          <SVG src={`/solid-cellular-signal-3.svg`} width={16} height={16} />
        </div>
      </div>
      <div className="merchListItemImage">
        <Image src={props.product.images[0]} alt="" width={447} height={559} />
      </div>
      <div className="merchListItemFooter">
        <div className="price">${props.product.price}</div>
        <div className="buy">Buy</div>
      </div>
    </div>
  );
}

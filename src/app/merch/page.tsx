"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  useFloating,
  useClick,
  useInteractions,
  autoUpdate,
} from "@floating-ui/react";
import SVG from "react-inlinesvg";
import Footer from "../components/footer";
import "./merch.css";
import "./merch-list-item.css";
import "./merch-item-modal.css";

export default function Merch() {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const onChangeItem = (item) => {
    const event = new CustomEvent("showstatic");
    document.dispatchEvent(event);

    const timeout = setTimeout(() => {
      const event = new CustomEvent("hidestatic");
      document.dispatchEvent(event);
      setSelectedItem(item);
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  };

  return (
    <div className="merch">
      <Link href="/" className="logo">
        <Image
          src={`/hand-small.png`}
          alt="GODHANDUSA"
          width={327}
          height={378}
        />
      </Link>
      <div className="list">
        <MerchListItem onClick={() => onChangeItem({})} />
        <MerchListItem onClick={() => onChangeItem({})} />
        <MerchListItem onClick={() => onChangeItem({})} />
        <MerchListItem onClick={() => onChangeItem({})} />
      </div>
      <ShoppingCart open={cartOpen} setOpen={setCartOpen} />
      {selectedItem && (
        <MerchItemModal
          // item={selectedItem}
          onClose={() => onChangeItem(null)}
        />
      )}
      <Footer />
    </div>
  );
}

function ShoppingCart({ open, setOpen }) {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div className="shoppingCart">
      <button className="cartButton" onClick={() => setOpen(true)}>
        <div className="label">Shpng Crt</div>
        <SVG src="/solid-cart.svg" width={32} height={32} />
      </button>
      {createPortal(
        <>
          <div
            className={`shoppingCartPanelBackdrop${open ? " open" : ""}`}
            onClick={() => setOpen(false)}
          />
          <div className={`shoppingCartPanel${open ? " open" : ""}`}>
            <div className="panelHeader">
              <div className="panelTitle">Shopping Cart</div>
              <div className="cartItemCount">0 Items</div>
              <button className="closeCart" onClick={() => setOpen(false)}>
                Exit
              </button>
            </div>
            <div className="panelBody">
              <div className="empty">
                Cart Status <span>Empty</span>
              </div>
            </div>
          </div>
        </>,
        document?.body
      )}
    </div>
  );
}

function MerchListItem({ onClick }) {
  const images = ["/merch/front.png", "/merch/back.png"];
  const image = images[0];

  return (
    <div className="merchListItem" onClick={onClick}>
      <div className="merchListItemHeader">
        <div className="title">[ITEM_00] T-Shirt</div>
        <div className="status">
          <SVG src={`/solid-cellular-signal-3.svg`} width={16} height={16} />
        </div>
      </div>
      <div className="merchListItemImage">
        <Image src={image} alt="" width={447} height={559} />
      </div>
      <div className="merchListItemFooter">
        <div className="price">$29.99</div>
        <div className="buy">Buy</div>
      </div>
    </div>
  );
}

function MerchItemModal({
  onClose,
  //item
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showSizes, setShowSizes] = useState(false);
  const [size, setSize] = useState<{ title: string; id: string } | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: showSizes,
    onOpenChange: setShowSizes,
    whileElementsMounted: autoUpdate,
    placement: "top",
  });

  const click = useClick(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click]);

  const handleSizeError = () => {
    setShowSizeError(true);

    setTimeout(() => {
      setShowSizeError(false);
    }, 2000);
  };

  const gotoNextImage = () => {
    setCurrentImage((currentImage) => {
      const nextImage = currentImage + 1;

      if (nextImage > images.length - 1) {
        return 0;
      }

      return nextImage;
    });
  };

  const gotoPreviousImage = () => {
    setCurrentImage((currentImage) => {
      const previousImage = currentImage - 1;

      if (previousImage < 0) {
        return images.length - 1;
      }

      return previousImage;
    });
  };

  const onBuyNow = async () => {
    if (!size) {
      handleSizeError();
      return;
    }
  };

  const onAddToCart = async () => {
    if (!size) {
      handleSizeError();
      return;
    }
  };

  const images = ["/merch/front.png", "/merch/back.png"];
  const variants: { title: string; id: string }[] = [
    { title: "Small", id: "small" },
    { title: "Medium", id: "medium" },
    { title: "Large", id: "large" },
  ];

  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <>
      <div className="merchItemModalBackdrop" onClick={onClose} />
      <div className="merchItemModal">
        <div className="merchItemModalHeader">
          <div className="title">[ITEM_00] T-Shirt</div>
          <button className="closeModal" onClick={onClose}>
            Exit
          </button>
        </div>
        <div className="merchItemModalBody">
          <div className="image">
            <button onClick={gotoPreviousImage}>&lt;&lt;</button>
            {images.map((image, index) => {
              return (
                <Image
                  key={image}
                  className={currentImage === index ? "show" : ""}
                  src={image}
                  alt=""
                  width={447}
                  height={559}
                />
              );
            })}
            <button onClick={gotoNextImage}>&gt;&gt;</button>
          </div>
          <div className="details">
            <button
              className={`sizeButton${showSizeError ? " error" : ""}`}
              ref={refs.setReference}
              {...getReferenceProps()}
            >
              [{size ? size.title : `Select Size`}]
            </button>
            {showSizes && (
              <div
                className="sizes"
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
              >
                {variants.map((variant) => {
                  return (
                    <button
                      key={variant.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSize(variant);
                        setShowSizes(false);
                      }}
                    >
                      {variant.title}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="price">$29.99</div>
          </div>
          <div className="buttons">
            <button onClick={onAddToCart}>Add to Cart</button>
            <button onClick={onBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>
    </>,
    document?.body
  );
}

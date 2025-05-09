"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/footer";
import "./merch.css";

export default function Merch() {
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
        <MerchItem />
        <MerchItem />
        <MerchItem />
        <MerchItem />
      </div>
      <Footer />
    </div>
  );
}

function MerchItem() {
  const [currentImage, setCurrentImage] = useState(0);
  const [previewImage, setPreviewImage] = useState(-1);

  const images = ["/merch/front.png", "/merch/back.png"];

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

  return (
    <>
      <div className="merchItem">
        <div className="header">
          <div className="title">[ITEM_00] T-Shirt</div>
          <div className="price">$29.99</div>
        </div>
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
                onClick={(event) => {
                  event.stopPropagation();
                  setPreviewImage(index);
                }}
              />
            );
          })}
          <button onClick={gotoNextImage}>&gt;&gt;</button>
        </div>
        <div className="footer">
          <div className="label">[Select Size]</div>
          <div className="buttons">
            <button>Add to Cart</button>
            <button>Buy Now</button>
          </div>
        </div>
      </div>
      {previewImage >= 0 && (
        <div className="previewImage">
          <button className="close" onClick={() => setPreviewImage(-1)}>
            Exit
          </button>
          <Image src={images[previewImage]} alt="" width={447} height={559} />
        </div>
      )}
    </>
  );
}

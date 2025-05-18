"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  useFloating,
  useClick,
  useInteractions,
  autoUpdate,
} from "@floating-ui/react";
import SVG from "react-inlinesvg";
import Cache from "../lib/cache";
import Shopify from "../lib/shopify";
import { Product, ProductVariant } from "../utils";
import GlitchText from "../components/glitch-text";
import MerchListItem from "./merch-list-item";
import "./merch.css";
import "./merch-list-item.css";
import "./merch-item-modal.css";

export default function MerchList({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<any>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const createShopifyCart = async () => {
      const cachedCartId: any = await Cache.getItem("cartId");
      const validCart = cachedCartId
        ? await Shopify.isCartValid(cachedCartId)
        : false;

      if (validCart) {
        const existingCart = await Shopify.getCart(cachedCartId);
        setCart(existingCart);
      } else {
        const cart = await Shopify.createCart();
        Cache.setItem("cartId", cart.id, 60);
        setCart(cart);
      }
    };

    createShopifyCart();
  }, []);

  return (
    <>
      <div className={`list${products.length === 1 ? " single" : ""}`}>
        {products.map((product, index) => {
          return (
            <MerchListItem
              key={product.id}
              index={index}
              product={{ ...product, index }}
              onClick={() => setSelectedProduct({ ...product, index })}
            />
          );
        })}
      </div>
      <ShoppingCart cart={cart} open={cartOpen} setOpen={setCartOpen} />
      {selectedProduct && (
        <MerchItemModal
          product={selectedProduct}
          cart={cart}
          onClose={() => {
            setSelectedProduct(null);
          }}
        />
      )}
    </>
  );
}

function ShoppingCart({ cart, open, setOpen }) {
  const [cartItems, setCartItems] = useState<any[]>([]);

  const getShopifyCartItems = useCallback(async () => {
    if (!cart) {
      return;
    }

    const cartItems = await Shopify.getCartItems(cart.id);
    setCartItems(cartItems);
  }, [cart]);

  useEffect(() => {
    document.addEventListener("updatecart", getShopifyCartItems);

    return () => {
      document.removeEventListener("updatecart", getShopifyCartItems);
    };
  }, [getShopifyCartItems]);

  useEffect(() => {
    if (!cart) {
      return;
    }

    getShopifyCartItems();
  }, [cart, getShopifyCartItems]);

  useEffect(() => {
    if (!cart || !open) {
      return;
    }

    getShopifyCartItems();
  }, [cart, open, getShopifyCartItems]);

  if (typeof window === "undefined") {
    return null;
  }

  const subtotal = () => {
    let amount = 0;

    cartItems.forEach(({ price }) => {
      amount += Number(price);
    });

    return amount;
  };

  const onRemoveCartItem = async (cartItem) => {
    if (!cart) {
      return;
    }

    await Shopify.removeFromCart(cart.id, [cartItem.id]);
    await getShopifyCartItems();
  };

  const onClickCheckout = () => {
    if (!cart) {
      return;
    }

    window.location.href = cart.checkoutUrl;
  };

  return (
    <div className="shoppingCart">
      <button className="cartButton" onClick={() => setOpen(true)}>
        <div className="label">Cart</div>
        {cartItems.length > 0 && (
          <div className="count">{cartItems.length}</div>
        )}
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
              <button className="closeCart" onClick={() => setOpen(false)}>
                Exit
              </button>
            </div>
            <div className="panelBody">
              {cartItems.length === 0 ? (
                <div className="empty">
                  Cart Status <span>Empty</span>
                </div>
              ) : (
                <div className="cartItems">
                  <div className="cartItemCount">{cartItems.length} Items</div>
                  {cartItems.map((cartItem, index) => {
                    return (
                      <div key={cartItem.id} className="cartItem">
                        <div className="cartItemImage">
                          <span>1x</span>
                          <Image
                            src={cartItem.image}
                            alt=""
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="cartItemTitle">
                          <div>
                            [ITEM_{`${index}`.padStart(2, "0")}]{" "}
                            {cartItem.productTitle}
                          </div>
                          <div className="cartItemSize">
                            {cartItem.variantTitle}
                          </div>
                        </div>
                        <div className="cartItemPrice">${cartItem.price}</div>
                        <button
                          className="cartItemRemove"
                          onClick={() => onRemoveCartItem(cartItem)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}

                  <div className="cartItemSubtotal">
                    <div className="cartItemSubtotalNote">
                      Shipping calculated at checkout
                    </div>
                    <div className="cartItemSubtotalAmount">
                      Subtotal ${subtotal()}
                    </div>
                  </div>
                  <button
                    className="cartItemCheckout"
                    onClick={onClickCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>,
        document?.body
      )}
    </div>
  );
}

function MerchItemModal({
  product,
  cart,
  onClose,
}: {
  product: Product;
  cart: any;
  onClose: () => void;
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showSizes, setShowSizes] = useState(false);
  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

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

      if (nextImage > product.images.length - 1) {
        return 0;
      }

      return nextImage;
    });
  };

  const gotoPreviousImage = () => {
    setCurrentImage((currentImage) => {
      const previousImage = currentImage - 1;

      if (previousImage < 0) {
        return product.images.length - 1;
      }

      return previousImage;
    });
  };

  const onBuyNow = async () => {
    if (!variant) {
      handleSizeError();
      return;
    }

    const newCart = await Shopify.createCart();

    await Shopify.addToCart(newCart.id, [
      { merchandiseId: variant.id, quantity: 1 },
    ]);

    window.location.href = newCart.checkoutUrl;
  };

  const onAddToCart = async () => {
    if (!cart) {
      return;
    }

    if (!variant) {
      handleSizeError();
      return;
    }

    await Shopify.addToCart(cart.id, [
      { merchandiseId: variant.id, quantity: 1 },
    ]);

    const event = new CustomEvent("updatecart");
    document.dispatchEvent(event);

    onClose();
  };

  if (typeof window === "undefined") {
    return null;
  }

  const price = () => {
    const selectedVariant = variant
      ? product.variants.find(({ id }) => id === variant.id)
      : null;

    return Number(selectedVariant?.price || product.price).toFixed(2);
  };

  if (fullscreen) {
    return (
      <div className="merchItemModalFullscreen">
        <Image
          src={product.images[currentImage]}
          alt=""
          width={447}
          height={559}
        />
        <button className="close" onClick={() => setFullscreen(false)}>
          Exit
        </button>
      </div>
    );
  }

  return createPortal(
    <>
      <div className="merchItemModalBackdrop" onClick={onClose} />
      <div className="merchItemModal">
        <div className="merchItemModalHeader">
          <div className="title">
            [ITEM_{`${product.index || 0}`.padStart(2, "0")}] {product.title}
          </div>
          <button className="closeModal" onClick={onClose}>
            Exit
          </button>
        </div>
        <div className="merchItemModalBody">
          <div className="image">
            <button className="fullscreen" onClick={() => setFullscreen(true)}>
              <SVG src={`/solid-scale.svg`} width={40} height={40} />
            </button>
            {product.images.length > 1 && (
              <button onClick={gotoPreviousImage}>&lt;&lt;</button>
            )}
            {product.images.map((image, index) => {
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
            {product.images.length > 1 && (
              <button onClick={gotoNextImage}>&gt;&gt;</button>
            )}
          </div>
          <div className="details">
            <button
              className={`sizeButton${showSizeError ? " error" : ""}`}
              ref={refs.setReference}
              {...getReferenceProps()}
            >
              [{variant ? variant.title : `Select Size`}]
            </button>
            {showSizes && (
              <div
                className="sizes"
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
              >
                {product.variants.map((variant) => {
                  return (
                    <button
                      key={variant.id}
                      className={!variant.availableForSale ? "soldOut" : ""}
                      onClick={(event) => {
                        event.stopPropagation();

                        if (!variant.availableForSale) {
                          setShowSizes(false);
                          return;
                        }

                        setVariant(variant);
                        setShowSizes(false);
                      }}
                    >
                      {variant.title}
                      {!variant.availableForSale ? <span>(Sold Out)</span> : ""}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="price">${price()}</div>
          </div>
          <div className="buttons">
            <button onClick={onAddToCart}>
              <GlitchText label="Add to Cart" hover />
            </button>
            <button onClick={onBuyNow}>
              <GlitchText label="Buy Now" hover />
            </button>
          </div>
        </div>
      </div>
    </>,
    document?.body
  );
}

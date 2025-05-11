export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: string[];
  price: string;
  soldOut: boolean;
  variants: ProductVariant[];
  index?: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: string;
}

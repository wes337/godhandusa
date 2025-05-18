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

export function randomNumberBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getGlitchLetter(letter: string) {
  if (!isNaN(parseInt(letter))) {
    return randomNumberBetween(0, 9);
  }

  switch (letter.toLowerCase()) {
    case "a":
      return "@";
    case "b":
      return "&";
    case "c":
      return "(";
    case "d":
      return "*";
    case "e":
      return "3";
    case "f":
      return "/";
    case "g":
      return "9";
    case "h":
      return "6";
    case "i":
      return "1";
    case "j":
      return "}";
    case "k":
      return "[";
    case "l":
      return "|";
    case "m":
      return "^";
    case "n":
      return "^";
    case "o":
      return "0";
    case "p":
      return "?";
    case "q":
      return "=";
    case "r":
      return "4";
    case "s":
      return "$";
    case "t":
      return "+";
    case "u":
      return "v";
    case "v":
      return "\\";
    case "w":
      return "@";
    case "x":
      return "%";
    case "y":
      return "7";
    case "z":
      return "=";
    default:
      return letter;
  }
}

export function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

import {
  createStorefrontApiClient,
  StorefrontApiClient,
} from "@shopify/storefront-api-client";
import Cache from "./cache";

export default class Shopify {
  static client: StorefrontApiClient;
  static domain = "06tudn-16.myshopify.com";
  static storefrontAccessToken = "cb54f13b85b20b4165c1741338ff0af0";

  static {
    Shopify.client = createStorefrontApiClient({
      apiVersion: "2025-07",
      storeDomain: Shopify.domain,
      publicAccessToken: Shopify.storefrontAccessToken,
    });
  }

  static async getProduct(handle: string) {
    const cachedProduct = await Cache.getItem(`product:${handle}`);

    if (cachedProduct) {
      return cachedProduct;
    }

    const { data } = await Shopify.client.request(
      `query ProductQuery($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 25) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }`,
      {
        variables: { handle },
      }
    );

    const product = {
      id: data.product.id,
      handle: data.product.handle,
      title: data.product.title,
      description: data.product.description,
      descriptionHtml: data.product.descriptionHtml,
      images:
        data.product.images?.edges?.length > 0
          ? data.product.images.edges.map(({ node }) => node.url || "")
          : [],
      soldOut: !data.product.variants.edges.some(
        ({ node }) => node.availableForSale
      ),
      price: `$${Number(data.product.priceRange.minVariantPrice.amount).toFixed(
        2
      )}`,
      variants:
        data.product.variants?.edges?.length > 0
          ? data.product.variants.edges.map(({ node }) => ({
              id: node.id,
              title: node.title,
              availableForSale: node.availableForSale,
            }))
          : [],
    };

    Cache.setItem(`product:${handle}`, product, 30);

    return product;
  }

  static async getProducts(first = 10, after = null) {
    const cachedProducts = await Cache.getItem(
      `products:${first}${after ? `:${after}` : ""}`
    );

    if (cachedProducts) {
      return cachedProducts;
    }

    const { data } = await Shopify.client.request(
      `query ProductsQuery($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              variants(first: 25) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 3) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }`,
      {
        variables: { first, after },
      }
    );

    const results = data.products.edges.map(({ node }) => {
      const images =
        node.images?.edges?.length > 0
          ? node.images.edges.map(({ node }) => node.url || "")
          : [];

      const soldOut = !node.variants.edges.some(
        ({ node }) => node.availableForSale
      );

      return {
        id: node.id,
        handle: node.handle,
        title: node.title,
        description: node.description,
        descriptionHtml: node.descriptionHtml,
        images,
        price: node.priceRange.minVariantPrice.amount,
        variants:
          node.variants?.edges?.length > 0
            ? node.variants.edges.map(({ node }) => ({
                id: node.id,
                title: node.title,
                availableForSale: node.availableForSale,
                price: node.price.amount,
              }))
            : [],
        soldOut,
      };
    });

    const hasMore = data.products.pageInfo?.hasNextPage || false;

    const products = {
      results,
      hasMore,
    };

    Cache.setItem(`products:${first}${after ? `:${after}` : ""}`, products, 5);

    return products;
  }

  static async getCart(cartId: string) {
    const { data } = await Shopify.client.request(
      `query CartQuery($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          estimatedCost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      {
        variables: { cartId },
      }
    );

    return data.cart;
  }

  static async isCartValid(cartId: string) {
    try {
      const { data } = await Shopify.client.request(
        `query CartQuery($cartId: ID!) {
          cart(id: $cartId) {
            id
            checkoutUrl
          }
        }`,
        {
          variables: { cartId },
        }
      );

      return !!(data && data.cart && data.cart.id);
    } catch {
      return false;
    }
  }

  static async createCart() {
    const { data } = await Shopify.client.request(`
      mutation CreateCart {
        cartCreate {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `);

    return data.cartCreate.cart;
  }

  static async addToCart(cartId: string, lines) {
    const { data } = await Shopify.client.request(
      `mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: { cartId, lines },
      }
    );

    return data.cartLinesAdd.cart;
  }

  static async removeFromCart(cartId: string, lineIds) {
    const { data } = await Shopify.client.request(
      `mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: { cartId, lineIds },
      }
    );

    return data.cartLinesRemove.cart;
  }

  static async emptyCart(cart) {
    if (
      !cart ||
      !cart.lines ||
      !cart.lines.edges ||
      cart.lines.edges.length === 0
    ) {
      return;
    }

    const lineIds = cart.lines.edges.map((edge) => edge.node.id);

    await Shopify.client.request(
      `mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: { cartId: cart.id, lineIds },
      }
    );
  }

  static async getCartItems(cartId: string) {
    const cart = await Shopify.getCart(cartId);

    if (
      !cart ||
      !cart.lines ||
      !cart.lines.edges ||
      cart.lines.edges.length === 0
    ) {
      return [];
    }

    return cart.lines.edges.map(({ node }) => {
      const merchandise = node.merchandise;

      return {
        id: node.id,
        quantity: node.quantity,
        variantId: merchandise.id,
        variantTitle: merchandise.title,
        productTitle: merchandise.product.title,
        productHandle: merchandise.product.handle,
        price: merchandise.price.amount,
        image: merchandise.image?.url || "",
      };
    });
  }
}

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    availableForSale
    options {
      name
      values
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 25) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
    addons: metafield(namespace: "custom", key: "addons") {
      references(first: 10) {
        nodes {
          ... on ProductVariant {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
            product {
              title
            }
          }
        }
      }
    }
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
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Products($first: Int = 20) {
    products(first: $first) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

export const PRODUCT_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Product($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

import { gql } from "@apollo/client";

export const getPublicProductById = gql`
query GetPublicProductById($getPublicProductByIdId: String!) {
  getPublicProductById(id: $getPublicProductByIdId) {
    _id
    name
    slug
    category
    image
    price
    brand
    rating
    numReviews
    countInStock
    description
  }
}
`
import { gql } from "@apollo/client";

export const getProductById = gql`
query GetProductById($getProductByIdId: String!) {
  getProductById(id: $getProductByIdId) {
    _id
    name
    slug
    category
    image
    price
    rating
    brand
    numReviews
    countInStock
    description
  }
}
`
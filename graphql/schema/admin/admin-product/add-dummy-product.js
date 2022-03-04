import { gql } from "@apollo/client";

export const addDummyProduct = gql`
query AddDummyProduct {
  addDummyProduct {
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
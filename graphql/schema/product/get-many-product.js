import { gql } from "@apollo/client";

export const getManyProduct = gql`
query Query {
  getManyProduct {
    _id
    name
    slug
    category
    image
    price
    brand
    rating
    countInStock
    numReviews
    description
  }
}
`
import { gql } from "@apollo/client";

export const getOneProduct = gql`
query Query($slug: String!) {
  getOneProduct(slug: $slug) {
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
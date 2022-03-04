import { gql } from "@apollo/client";

export const getProductManyReviewById = gql`
query GetProductManyReviewById($getProductManyReviewByIdId: String!) {
  getProductManyReviewById(id: $getProductManyReviewByIdId) {
    user {
      _id
      name
      email
      isAdmin
    }
    name
    rating
    comment
  }
}
`
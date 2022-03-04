import { gql } from "@apollo/client";

export const getProductManyReviewById = gql`
query GetProductManyReviewById($getProductManyReviewByIdId: String!) {
  getProductManyReviewById(id: $getProductManyReviewByIdId) {
    user {
      isAdmin
      email
      name
      _id
    }
    name
    rating
    comment
    createdAt
  }
}
`
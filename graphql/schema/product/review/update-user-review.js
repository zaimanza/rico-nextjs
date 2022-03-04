import { gql } from "@apollo/client";

export const updateUserReview = gql`
query Query($updateUserReviewId: String!, $rating: Int!, $comment: String) {
  updateUserReview(id: $updateUserReviewId, rating: $rating, comment: $comment)
}
`
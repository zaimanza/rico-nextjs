import { gql } from "@apollo/client";

export const deleteProductById = gql`
query Query($deleteProductByIdId: String!) {
  deleteProductById(id: $deleteProductByIdId)
}
`
import { gql } from "@apollo/client";

export const updateProductById = gql`
query Query($updateProductByIdId: String!, $updateData: updateProductReq) {
  updateProductById(id: $updateProductByIdId, updateData: $updateData)
}
`
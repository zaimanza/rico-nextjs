import { gql } from "@apollo/client";

export const addOneProduct = gql`
mutation AddOneProduct($product: productReq) {
  addOneProduct(product: $product)
}
`
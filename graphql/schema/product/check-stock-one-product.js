import { gql } from "@apollo/client";

export const checkStockOneProduct = gql`
query Query($checkStockOneProductId: String!, $quantity: Int!) {
  checkStockOneProduct(id: $checkStockOneProductId, quantity: $quantity)
}
`
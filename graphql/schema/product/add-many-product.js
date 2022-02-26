import { gql } from "@apollo/client";

export const addManyProduct = gql`
mutation AddManyProduct($products: [productReq!]) {
  addManyProduct(products: $products)
}
`
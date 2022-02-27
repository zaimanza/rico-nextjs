import { gql } from "@apollo/client";

export const getOneOrder = gql`
query GetOneOrder($getOneOrderId: String!) {
  getOneOrder(id: $getOneOrderId) {
    _id
    user {
      isAdmin
      email
      name
      _id
    }
    shippingAddress {
      location {
        vicinity
        googleAddressId
        name
        address
        lng
        lat
      }
      fullName
      address
      city
      postalCode
      country
    }
    paymentMethod
    paymentResult {
      email_address
      status
      id
    }
    itemsPrice
    shippingPrice
    taxPrice
    totalPrice
    isPaid
    isDelivered
    paidAt
    deliveredAt
    orderItems {
      _id
      name
      quantity
      image
      price
    }
  }
}
`
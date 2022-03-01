import { gql } from "@apollo/client";

export const updateOrderDeliver = gql`
query Query($updateOrderDeliverId: String!) {
  updateOrderDeliver(id: $updateOrderDeliverId) {
    _id
    user {
      _id
      name
      email
      isAdmin
    }
    shippingAddress {
      fullName
      address
      city
      postalCode
      country
      location {
        lat
        lng
        address
        name
        vicinity
        googleAddressId
      }
    }
    paymentMethod
    paymentResult {
      id
      status
      email_address
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
      price
      image
      quantity
      name
      _id
    }
  }
}
`
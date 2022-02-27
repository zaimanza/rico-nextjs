import { gql } from "@apollo/client";

export const payOrder = gql`
query Query($orderId: String!, $status: String!, $emailAddress: String!, $payOrderId: String!) {
  payOrder(orderId: $orderId, status: $status, email_address: $emailAddress, id: $payOrderId) {
    _id
    user {
      isAdmin
      email
      name
      _id
    }
    shippingAddress {
      location {
        googleAddressId
        vicinity
        name
        address
        lng
        lat
      }
      country
      postalCode
      city
      address
      fullName
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
      price
      image
      quantity
      name
      _id
    }
  }
}
`
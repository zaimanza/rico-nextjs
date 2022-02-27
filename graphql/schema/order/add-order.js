import { gql } from "@apollo/client";

export const addOrder = gql`
mutation AddOrder($paymentMethod: String!, $orderItems: [orderItemReq!], $itemsPrice: Float, $shippingAddress: shippingAddressReq!, $shippingPrice: Float, $taxPrice: Float, $totalPrice: Float) {
  addOrder(paymentMethod: $paymentMethod, orderItems: $orderItems, itemsPrice: $itemsPrice, shippingAddress: $shippingAddress, shippingPrice: $shippingPrice, taxPrice: $taxPrice, totalPrice: $totalPrice) {
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
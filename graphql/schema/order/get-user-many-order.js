import { gql } from "@apollo/client";

export const getUserManyOrder = gql`
query GetUserManyOrder {
  getUserManyOrder {
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
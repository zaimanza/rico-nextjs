import { gql } from "@apollo/client";

export const getManyOrder = gql`
query GetManyOrder {
  getManyOrder {
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
        googleAddressId
        vicinity
        name
        address
        lng
        lat
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
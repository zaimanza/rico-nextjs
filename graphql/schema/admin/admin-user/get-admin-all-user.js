import { gql } from "@apollo/client";

export const getAdminAllUser = gql`
query GetAdminAllUser {
  getAdminAllUser {
    _id
    name
    email
    password
    isAdmin
  }
}
`
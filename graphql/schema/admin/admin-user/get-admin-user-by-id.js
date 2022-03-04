import { gql } from "@apollo/client";

export const getAdminUserById = gql`
query GetAdminUserById($getAdminUserByIdId: String!) {
  getAdminUserById(id: $getAdminUserByIdId) {
    _id
    name
    email
    password
    isAdmin
  }
}
`
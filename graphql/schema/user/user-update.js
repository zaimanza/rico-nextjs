import { gql } from "@apollo/client";

export const userUpdate = gql`
mutation UserUpdate($password: String, $email: String, $name: String) {
  userUpdate(password: $password, email: $email, name: $name) {
    token
    _id
    name
    email
    isAdmin
  }
}
`
import { gql } from "@apollo/client";

export const userLogin = gql`
query UserLogin($email: String!, $password: String!) {
  userLogin(email: $email, password: $password) {
    _id
    token
    name
    email
    isAdmin
  }
}
`
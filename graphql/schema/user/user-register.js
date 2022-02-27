import { gql } from "@apollo/client";

export const userRegister = gql`
mutation UserRegister($name: String!, $email: String!, $password: String!) {
  userRegister(name: $name, email: $email, password: $password) {
    token
    name
    _id
    email
    isAdmin
  }
}
`
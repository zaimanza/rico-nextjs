import { gql } from "@apollo/client";

export const updateAdminUserById = gql`
query Query($updateAdminUserByIdId: String!, $name: String, $email: String) {
  updateAdminUserById(id: $updateAdminUserByIdId, name: $name, email: $email)
}
`
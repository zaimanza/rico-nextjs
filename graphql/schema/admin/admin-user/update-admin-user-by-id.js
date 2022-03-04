import { gql } from "@apollo/client";

export const updateAdminUserById = gql`
query Query($updateAdminUserByIdId: String!, $name: String, $isAdmin: Boolean) {
  updateAdminUserById(id: $updateAdminUserByIdId, name: $name, isAdmin: $isAdmin)
}
`
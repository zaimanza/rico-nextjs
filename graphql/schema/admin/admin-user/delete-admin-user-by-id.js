import { gql } from "@apollo/client";

export const deleteAdminUserById = gql`
query Query($deleteAdminUserByIdId: String!) {
  deleteAdminUserById(id: $deleteAdminUserByIdId)
}
`
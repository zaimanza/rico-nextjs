import { gql } from "@apollo/client";

export const dashboardSummary = gql`
query DashboardSummary {
  dashboardSummary {
    ordersCount
    productsCount
    usersCount
    ordersPrice
    salesData {
      totalSales
      _id
    }
  }
}
`
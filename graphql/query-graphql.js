
import useApolloClient from './apollo-client';


function useQueryGraphql() {

    const [client] = useApolloClient()

    const queryGraphql = async (query, variables) => {
        const { data, errors } = await client.query({
            query: query,
            variables: variables,
        })

        // handle if error
        if (errors) {
            console.log('graphql query error')
            return false
        }

        return data
    }

    return [queryGraphql]
}
export default useQueryGraphql
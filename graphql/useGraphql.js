
import useApolloClient from './useApolloClient';


function useGraphql() {

    const [client] = useApolloClient()

    const query = async (query, variables) => {
        const { data, errors } = await client.query({ query: query, variables: variables, })

        // handle if error
        if (errors) {
            console.log('graphql query error')
            return false
        }

        return data
    }

    const mutate = async (mutation, variables) => {
        const { data, errors } = await client.mutate({ mutation: mutation, variables: variables })

        // handle if error
        if (errors) {
            console.log('graphql mutate error')
            return false
        }

        return data
    }

    return [query, mutate]
}
export default useGraphql
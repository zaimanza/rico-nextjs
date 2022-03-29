
import useApolloClient from './useApolloClient';


function useGraphql() {

    const [client] = useApolloClient()

    const query = async (query, variables) => {
        let options = { query: query, }

        if (Object.keys(variables).length !== 0) {
            options.variables = variables
        }

        const { data, errors } = await client.query(options)

        // handle if error
        if (errors) {
            console.log('graphql query error')
            return false
        }

        return data
    }

    const mutate = async (mutation, variables) => {
        let options = { mutation: mutation, }

        if (Object.keys(variables).length !== 0) {
            options.variables = variables
        }

        const { data, errors } = await client.mutate(options)

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
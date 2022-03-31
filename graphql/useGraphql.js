
import { useSnackbar } from 'notistack';
import useApolloClient from './useApolloClient';


function useGraphql() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [client] = useApolloClient()

    const query = async (query, variables) => {
        closeSnackbar();
        let options = { query: query, }

        if (Object.keys(variables).length !== 0) {
            options.variables = variables
        }

        const { data, errors } = await client.query(options)

        // handle if error
        if (errors) {
            console.log('graphql query error')
            errors.forEach(
                ({ message, locations, path }) => {
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    )
                    console.log(message)
                    enqueueSnackbar(
                        message,
                        {
                            // variant: 'error',
                            // variant: 'default',
                            // variant: 'success',
                            variant: 'warning',
                            // variant: 'info',
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                            },
                            preventDuplicate: true,
                        }
                    )
                }
            )
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
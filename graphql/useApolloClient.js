import { ApolloClient, createHttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";
import { useRouter } from 'next/router';

function useApolloClient() {
    // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();

    const httpLink = createHttpLink({ uri: "http://localhost:4001/graphql", });

    const authLink = setContext((_, { headers }) => {
        let token
        // get the authentication token from local storage if it exists
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token')
        }
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
            }
        }
    });
    const defaultOptions = {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    }

    const errorLink = onError(({ graphQLErrors, networkError }) => {
        // closeSnackbar();
        if (graphQLErrors)
            console.log('Theres an error')
        // graphQLErrors.forEach(
        //     ({ message, locations, path }) => {
        //         console.log(
        //             `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        //         )
        //         console.log(message)
        //         enqueueSnackbar(
        //             message,
        //             {
        //                 // variant: 'error',
        //                 // variant: 'default',
        //                 // variant: 'success',
        //                 variant: 'warning',
        //                 // variant: 'info',
        //                 anchorOrigin: {
        //                     vertical: 'bottom',
        //                     horizontal: 'left',
        //                 },
        //                 preventDuplicate: true,
        //             }
        //         )
        //     }
        // )

        if (networkError) router.push('/500')
    });

    const client = new ApolloClient({
        link: from([errorLink, authLink, httpLink]),
        cache: new InMemoryCache(),
        defaultOptions: defaultOptions,
    });

    return [client]
}
export default useApolloClient


// import { ApolloClient, InMemoryCache } from "@apollo/client";

// const client = new ApolloClient({
//     uri: "https://manza-backend.herokuapp.com/graphql",
//     cache: new InMemoryCache(),
// });

// export default client;


import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: "https://hirodeli.herokuapp.com/graphql",
});

const authLink = setContext((_, { headers }) => {
    let token
    // get the authentication token from local storage if it exists
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
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

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
});


export default client;
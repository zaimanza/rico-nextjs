
import client from './apollo-client';


const queryGraphql = async (query, variables) => {
    const { data } = await client.query({
        query: query,
        variables: variables,
    })

    // handle if error
    return data
}

export default queryGraphql
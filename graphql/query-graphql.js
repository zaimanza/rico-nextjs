
import client from './apollo-client';


const queryGraphql = async (query, variables) => {
    const { data, errors } = await client.query({
        query: query,
        variables: variables,
    })

    // handle if error
    if (errors) {
        console.log('graphql query error')
        console.log(errors[0].message)
    }

    return data
}

export default queryGraphql
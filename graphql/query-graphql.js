
import client from './apollo-client';
import { useSnackbar } from 'notistack';


function useQueryGraphql() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const queryGraphql = async (query, variables) => {
        closeSnackbar();
        const { data, errors } = await client.query({
            query: query,
            variables: variables,
        })

        // handle if error
        if (errors) {
            console.log('graphql query error')
            console.log(errors[0].message)
            enqueueSnackbar(
                errors[0].message,
                { variant: 'error' }
            );
            return {}
        }

        return data
    }



    return [queryGraphql]
}

export default useQueryGraphql

// const useQueryGraphql = async (query, variables) => {
//     // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
//     // closeSnackbar();
//     const { data, errors } = await client.query({
//         query: query,
//         variables: variables,
//     })

//     // handle if error
//     if (errors) {
//         console.log('graphql query error')
//         console.log(errors[0].message)
//         // enqueueSnackbar(
//         //     errors[0].message,
//         //     { variant: 'error' }
//         // );
//     }

//     return data
// }

// export default useQueryGraphql
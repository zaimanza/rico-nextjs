import { useContext } from 'react';
import useQueryGraphql from '../graphql/query-graphql';
import { userLogin } from '../graphql/schema/user/user-login';
import { Store } from '../utils/Store';

function useStoreOwnerModule() {
    const { dispatch } = useContext(Store);
    const [queryGraphql] = useQueryGraphql()



    const storeOwnerLogin = async (variables) => {
        const data = await queryGraphql(userLogin, variables)

        if (data?.userLogin?.token) {
            dispatch({ type: 'USER_LOGIN', payload: data.userLogin });
            localStorage.setItem('userInfo', JSON.stringify(data.userLogin));
            localStorage.setItem("token", data.userLogin.token);
        }
        return data?.userLogin
    }



    return [storeOwnerLogin]
}
export default useStoreOwnerModule



// const StoreOwnerLogin = async (dispatch, variables) => {
//     // console.log(variables)
//     const data = await queryGraphql(userLogin, variables)

//     if (data.userLogin.token) {
//         dispatch({ type: 'USER_LOGIN', payload: data.userLogin });
//         localStorage.setItem('userInfo', JSON.stringify(data.userLogin));
//         localStorage.setItem("token", data.userLogin.token);
//     }
// }

// export default StoreOwnerLogin
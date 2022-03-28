import { useContext } from 'react';
import useGraphql from '../graphql/useGraphql'
import { userLogin } from '../graphql/schema/user/user-login';
import { Store } from '../utils/Store';

function useStoreOwnerModule() {
    const { dispatch } = useContext(Store);
    const [query] = useGraphql()



    const storeOwnerLogin = async (variables) => {
        const data = await query(userLogin, variables)

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
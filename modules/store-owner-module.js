// import { useContext } from 'react';
import queryGraphql from '../graphql/query-graphql';
import { userLogin } from '../graphql/schema/user/user-login';
// import { Store } from '../utils/Store';

const StoreOwnerLogin = async (dispatch, variables) => {
    console.log(variables)
    const data = await queryGraphql(userLogin, variables)

    if (data.userLogin.token) {
        dispatch({ type: 'USER_LOGIN', payload: data.userLogin });
        localStorage.setItem('userInfo', JSON.stringify(data.userLogin));
        localStorage.setItem("token", data.userLogin.token);
    }
}

export default StoreOwnerLogin
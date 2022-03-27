
import { createContext, useReducer } from 'react';

export const User = createContext();


const initialState = {
    userInfo: typeof window !== 'undefined' ? localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null : null,
    shippingAddress: typeof window !== 'undefined' ? localStorage.getItem('shippingAddress')
        ? JSON.parse(localStorage.getItem('shippingAddress'))
        : {} : {},
    paymentMethod: typeof window !== 'undefined' ? localStorage.getItem('paymentMethod')
        ? localStorage.getItem('paymentMethod')
        : '' : '',
};



function reducer(state, action) {
    switch (action.type) {
        case 'USER_LOGIN':
            return { ...state, userInfo: action.payload };
        case 'USER_LOGOUT':
            return {
                ...state,
                userInfo: null,
                cart: { cartItems: [] },
                shippingAddress: {},
                paymentMethod: '',
            };
        case 'SAVE_SHIPPING_ADDRESS':
            return {
                ...state,
                shippingAddress: action.payload,
            };
        case 'SAVE_PAYMENT_METHOD':
            return {
                ...state,
                paymentMethod: action.payload,
            };
        default:
            return state;
    }
}

export function UserProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <User.Provider value={value}>{props.children}</User.Provider>;
}
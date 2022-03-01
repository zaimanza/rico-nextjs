
import { createContext, useReducer } from 'react';

export const Store = createContext();


const initialState = {
    darkMode: typeof window !== 'undefined' ? localStorage.getItem('darkMode') === 'ON' ? true : false : false,
    cart: {
        cartItems: typeof window !== 'undefined' ? localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [] : [],
    },
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
        case 'DARK_MODE_ON':
            return { ...state, darkMode: true };
        case 'DARK_MODE_OFF':
            return { ...state, darkMode: false };
        case 'CART_ADD_ITEM': {
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find(
                (item) => item._id === newItem._id
            );
            const cartItems = existItem
                ? state.cart.cartItems.map((item) =>
                    item.name === existItem.name ? newItem : item
                )
                : [...state.cart.cartItems, newItem];
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        }
        case 'CART_REMOVE_ITEM': {
            const cartItems = state.cart.cartItems.filter(
                (item) => item._id !== action.payload._id
            );
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        }
        case 'CART_CLEAR':
            return { ...state, cart: { ...state.cart, cartItems: [] } };
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

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
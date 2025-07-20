import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "~/Features/Cart/cartSlice";
import checkoutReducer from "~/Features/Checkout/checkoutSlice";
import toastReducer from "~/Features/Toast/toastSlice";
import authModalReducer from "~/Features/AuthModal/authModalSlice";

const store = configureStore({
    reducer: {
        //giỏ hàng
        cart: cartReducer,
        // checkout
        checkout: checkoutReducer,
        // toast
        toast: toastReducer,
        // auth modal
        authModal: authModalReducer,
    },
});
export default store;

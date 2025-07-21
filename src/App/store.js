import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "~/Features/Cart/cartSlice";
import checkoutReducer from "~/Features/Checkout/checkoutSlice";
import toastReducer from "~/Features/Toast/toastSlice";
import authModalReducer from "~/Features/AuthModal/authModalSlice";
import avatarModalReducer from "~/Features/AvatarModal/AvatarModalSlice";

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
        // avatar modal
        avatarModal: avatarModalReducer,
    },
});
export default store;

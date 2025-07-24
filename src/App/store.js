import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "~/Features/Cart/cartSlice";
import checkoutReducer from "~/Features/Checkout/checkoutSlice";
import toastReducer from "~/Features/Toast/toastSlice";
import authModalReducer from "~/Features/AuthModal/authModalSlice";
import avatarModalReducer from "~/Features/AvatarModal/AvatarModalSlice";
import authReducer from "~/Features/Auth/AuthSlice";
import verifyReducer from "~/Features/Verify/VerifySlice";

const store = configureStore({
    reducer: {
        // auth
        auth: authReducer,
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
        // verify
        verify: verifyReducer,
    },
});
let timeout;
store.subscribe(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        try {
            const state = store.getState().verify;
            const authStatus = store.getState().auth.authStatus;
            sessionStorage.setItem("authVerify", JSON.stringify(state));
            sessionStorage.setItem("authStatus", JSON.stringify(authStatus));
        } catch {}
    }, 300); // Chờ 300ms mới lưu, tránh spam ghi
});
export default store;

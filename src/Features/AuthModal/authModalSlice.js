import { createSlice } from "@reduxjs/toolkit";

const init = { isShowAuthModal: false, isFormLogin: true };

const authModalSlice = createSlice({
    name: "authModal",
    initialState: init,
    reducers: {
        // open auth
        openAuthModal(state, action) {
            state.isShowAuthModal = true;
            state.isFormLogin = action.payload?.isFormLogin ?? true;
        },
        // set auth
        setAuthModal(state, action) {
            state.type = action.payload?.isFormLogin ?? true;
        },
        // close auth
        closeAuthModal(state) {
            state.isShowAuthModal = false;
            state.isFormLogin = true;
        },
    },
});

export const { openAuthModal, setAuthModal, closeAuthModal } =
    authModalSlice.actions;

export default authModalSlice.reducer;

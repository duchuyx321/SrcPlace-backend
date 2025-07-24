import { createSlice } from "@reduxjs/toolkit";

const init = {
    user: {},
    isLogin: false,
    authStatus: {
        isSession: false,
        isEnabled2FA: false,
        isTrustDevices: false,
        isVerify2FA: false,
    },
};

const authSlice = createSlice({
    name: "auth",
    initialState: init,
    reducers: {
        // add data login and register
        adDataAuth(state, action) {
            state.user = action.payload.user || {};
            // thêm các thông tin bên dưới
            state.isLogin = true;
            state.authStatus.isSession = action.payload?.isSession || false;
            state.authStatus.isEnabled2FA =
                action.payload?.isEnabled2FA || false;
            state.authStatus.isTrustDevices =
                action.payload?.isTrustDevices || false;
            state.authStatus.isVerify2FA = action.payload?.isVerify2FA || false;
        },
        updateAuthStatus(state, action) {
            const payload = action.payload;
            state.authStatus.isSession = payload.isSession || false;
            state.authStatus.isEnabled2FA = payload.isEnabled2FA || false;
            state.authStatus.isTrustDevices = payload.isTrustDevices || false;
            state.authStatus.isVerify2FA = payload.isVerify2FA || false;
        },
        //  logout => clear data
        clearDataAuth(state) {
            state.user = init.user;
            state.isLogin = init.isLogin;
            state.authStatus = init.authStatus;
        },
    },
});
export const { adDataAuth, clearDataAuth, updateAuthStatus } =
    authSlice.actions;
export default authSlice.reducer;

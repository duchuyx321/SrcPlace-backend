import { createSlice } from "@reduxjs/toolkit";

const init = { user: {} };

const authSlice = createSlice({
    name: "auth",
    initialState: init,
    reducers: {
        // add data login and register
        adDataAuth(state, action) {
            state.user = action.payload.user || {};
            // thêm các thông tin bên dưới
        },
        // edit data auth
        editDataAuth(state, action) {
            if (!state.user) return;
            if (typeof action.payload.user !== "object") return;
            state.user = {
                ...action.payload.user,
                ...state.user,
            };
        },
        //  logout => clear data
        clearDataAuth(state) {
            state.user = init.user;
        },
    },
});
export const { adDataAuth, clearDataAuth, editDataAuth } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const init = {
    toasts: [],
};

const toastSlice = createSlice({
    name: "toast",
    initialState: init,
    reducers: {
        // add toast
        addToast(state, action) {
            const toast = {
                id: uuid(),
                type: action.payload.type,
                title: action.payload.title,
                duration: action.payload.duration,
            };
            state.toasts.push(toast);
        },
        // xóa toast
        removeToast(state, action) {
            const id = action.payload?.id;
            state.toasts = state.toasts.filter((item) => item.id !== id);
        },
        // clear toast
        clearToast(state) {
            state.toasts = [];
        },
    },
});
export const { clearToast, addToast, removeToast } = toastSlice.actions;

export default toastSlice.reducer;

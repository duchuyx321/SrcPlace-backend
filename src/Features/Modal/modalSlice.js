import { createSlice } from "@reduxjs/toolkit";

const init = {
    isShowModal: false,
    isClickBtnCancel: false,
    isClickBtnConfirm: false,
    isCloseModal: false,
    result: {
        isEventCloseModal: false,
        type: null,
        title: null,
        description: null,
        titleBtnConfirm: null,
    },
};

const modalSlice = createSlice({
    name: "modal",
    initialState: init,
    reducers: {
        // open modal
        openModal(state, action) {
            state.isShowModal = true;
            state.isEventCloseModal = action.payload.isEventCloseModal || false;
            state.result = {
                title: action.payload.title || "",
                description: action.payload.description || "",
                type: action.payload.type || "", // [info, success, warning, error]
                titleBtnConfirm: action.payload.titleBtnConfirm || "",
            };
        },
        // clickBtn modal
        clickBtnModal(state, action) {
            const allowedKeys = [
                "isClickBtnCancel",
                "isClickBtnConfirm",
                "isCloseModal",
            ];
            const key = action.payload.key || "isClickBtnCancel";
            if (allowedKeys.includes(key)) {
                state[key] = true;
            }
        },

        // close modal
        closeModal(state) {
            state.isShowModal = init.isShowModal;
            state.isClickBtnCancel = init.isClickBtnCancel;
            state.isClickBtnConfirm = init.isClickBtnConfirm;
            state.isCloseModal = init.isCloseModal;
            state.result = init.result;
        },
    },
});

export const { closeModal, openModal, clickBtnModal } = modalSlice.actions;
export default modalSlice.reducer;

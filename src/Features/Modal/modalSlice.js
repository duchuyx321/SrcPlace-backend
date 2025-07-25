import { createSlice } from "@reduxjs/toolkit";

const init = {
    isShowModal: false,
    isEventCloseModal: false,
    result: {
        title: null,
        description: null,
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
            };
        },
        // update modal
        updateModal(state, action) {
            state.isShowModal = true;
            state.isEventCloseModal = action.payload.isEventCloseModal || false;
            state.result = {
                title: action.payload.title || "",
                description: action.payload.description || "",
            };
        },
        // close modal
        closeModal(state) {
            state.isShowModal = init.isShowModal;
            state.isEventCloseModal = init.isEventCloseModal;
            state.result = init.result;
        },
    },
});

export const { closeModal, openModal, updateModal } = modalSlice.actions;
export default modalSlice.reducer;

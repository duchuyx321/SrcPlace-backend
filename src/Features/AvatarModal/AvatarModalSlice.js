import { createSlice } from "@reduxjs/toolkit";

const init = { isShowAvatarModal: false };

const AvatarModalSlice = createSlice({
    name: "avatarModal",
    initialState: init,
    reducers: {
        // open Avatar
        openAvatarModal(state, action) {
            state.isShowAvatarModal = true;
        },
        // close Avatar
        closeAvatarModal(state) {
            state.isShowAvatarModal = false;
        },
    },
});

export const { openAvatarModal, closeAvatarModal } = AvatarModalSlice.actions;

export default AvatarModalSlice.reducer;

const { createSlice } = require("@reduxjs/toolkit");

const getInitialState = () => {
    try {
        const saved = sessionStorage.getItem("authVerify");
        const parsed = JSON.parse(saved);
        if (
            parsed &&
            typeof parsed.result?.isVerifying === "boolean" &&
            typeof parsed.result?.email === "string"
        ) {
            return parsed;
        }
    } catch {}
    return {
        isVerifying: false,
        result: {
            isClose: false,
            isShowListMethod: false,
            email: null,
            title: null,
            description: null,
        },
    };
};

const verifySlice = createSlice({
    name: "authVerify",
    initialState: getInitialState(),
    reducers: {
        startVerifying: (state, action) => {
            state.isVerifying = true;
            state.result.email = action.payload?.email;
            state.result.isClose = action.payload?.isClose;
            state.result.title = action.payload?.title;
            state.result.description = action.payload?.description;
            state.result.isShowListMethod = action.payload?.isShowListMethod;
        },
        stopVerifying: (state) => {
            state.isVerifying = false;
            state.result.isClose = false;
            state.result.isShowListMethod = false;
            state.result.email = null;
            state.result.title = null;
            state.result.description = null;
        },
    },
});
export const { startVerifying, stopVerifying } = verifySlice.actions;
export default verifySlice.reducer;

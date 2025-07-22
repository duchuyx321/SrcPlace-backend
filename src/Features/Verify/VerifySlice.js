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
        result: {
            isVerifying: false,
            email: null,
            isClose: false,
            title: null,
        },
    };
};

const verifySlice = createSlice({
    name: "authVerify",
    initialState: getInitialState(),
    reducers: {
        startVerifying: (state, action) => {
            state.result.isVerifying = true;
            state.result.email = action.payload?.email;
            state.result.isClose = action.payload?.isClose;
            state.result.title = action.payload?.title;
        },
        stopVerifying: (state) => {
            state.result.isVerifying = false;
            state.result.isClose = false;
            state.result.email = null;
            state.result.title = null;
        },
    },
});
export const { startVerifying, stopVerifying } = verifySlice.actions;
export default verifySlice.reducer;

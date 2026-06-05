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
            state.result = { ...state.result, ...action.payload };
        },
        stopVerifying: (state) => {
            state.isVerifying = false;
            state.result = {
                isClose: false,
                isShowListMethod: false,
                email: null,
                title: null,
                description: null,
            };
        },
        rehydrateVerify: (state, action) => {
            return action.payload; // restore toàn bộ state từ sessionStorage
        },
    },
});
export const { startVerifying, stopVerifying, rehydrateVerify } =
    verifySlice.actions;
export default verifySlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const init = { items: [], total: 0, isFetched: false };

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: init,
    reducers: {
        // buyNow
        buyNow(state, action) {
            state.isFetched = true;
            state.items = [
                {
                    _id: action.payload._id,
                    title: action.payload.title,
                    thumbnail: action.payload.image_url,
                    price: action.payload.price,
                },
            ];
        },
        // addToBuy
        addToBuy(state, action) {
            const product = state.items.find(
                (product) => product._id === action.payload._id
            );
            if (product) {
                state.result = {
                    status: 403,
                    message: "Đơn hàng đã có trong giỏ hàng!",
                };
                return;
            }
            state.items.push({
                _id: action.payload._id,
                slug: action.payload.slug,
                title: action.payload.title,
                thumbnail: action.payload.image_url,
                price: action.payload.price,
            });
        },
        // setToBuy
        setToBuy(state, action) {
            const itemsAddBuy = Array.isArray(action.payload)
                ? action.payload
                : [action.payload];
            state.items = itemsAddBuy;
        },
        // removeItemsBuy
        removeItemsBuy(state, action) {
            const itemsRemove = Array.isArray(action.payload)
                ? action.payload
                : [action.payload];
            state.items = state.items.filter(
                (product) => !itemsRemove.includes(product._id)
            );
        },
        // calculateTotal
        calculateTotalBuy(state) {
            state.total = state.items.reduce((amount, product) => {
                return amount + product.price;
            }, 0);
        },
        // clear
        clearBuy(state) {
            state.items = [];
            state.total = 0;
        },
    },
});

export const {
    addToBuy,
    buyNow,
    calculateTotalBuy,
    clearBuy,
    removeItemsBuy,
    setToBuy,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;

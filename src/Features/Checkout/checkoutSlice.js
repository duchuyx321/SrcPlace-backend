import { createSlice } from "@reduxjs/toolkit";

const init = {
    items: [],
    total: 0,
    isFetched: false,
    vouchers: [], //{ code: null, discount: 0 }
    finalTotal: 0,
};

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
        // updateCheckout
        updateCheckout(state, action) {
            state.isFetched = true;
            state.items = action.payload.products || [];
            state.vouchers = action.payload.vouchers || [];
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
            const total = state.items.reduce((amount, product) => {
                return amount + product.price;
            }, 0);
            state.total = total;
            state.finalTotal = total;
        },
        addVoucher(state, action) {
            state.vouchers.push({
                code: action.payload.code,
                discount: action.payload.discount,
            });
        },
        removeVoucher(state, action) {
            state.vouchers = state.vouchers.filter(
                (item) => item.code !== action.payload.code
            );
        },
        recalculateFinalTotal(state) {
            const totalDiscount = state.vouchers.reduce(
                (sum, voucher) => sum + (voucher.discount || 0),
                0
            );
            state.finalTotal = Math.max(0, state.total - totalDiscount);
        },
        // clear
        clearBuy(state) {
            state.items = init.items;
            state.total = init.total;
            state.isFetched = init.isFetched;
            state.vouchers = init.vouchers;
            state.finalTotal = init.finalTotal;
        },
    },
});

export const {
    addToBuy,
    buyNow,
    calculateTotalBuy,
    clearBuy,
    updateCheckout,
    removeItemsBuy,
    setToBuy,
    addVoucher,
    recalculateFinalTotal,
    removeVoucher,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;

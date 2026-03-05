import * as httpRequest from "~/Util/httpsRequest";

class CheckoutController {
    // get checkout
    async getCheckout() {
        try {
            const result = await httpRequest("user/checkout");
            return result.data;
        } catch (error) {
            return { error };
        }
    }
    // add checkout
    async addCheckout({ product_IDs = [], voucher_IDs = [] }) {
        try {
            const result = await httpRequest.POST("user/checkout/add", {
                product_IDs,
                voucher_IDs,
            });
            return result.data;
        } catch (error) {
            return { error };
        }
    }
    // add voucher
    async addVoucherCheckout({ voucher_IDs }) {
        try {
            const result = await httpRequest.PATCH(
                "user/checkout/add-voucher",
                {
                    voucher_IDs,
                }
            );
            return result.data;
        } catch (error) {
            return { error };
        }
    }
    // remove voucher
    async removeVoucherCheckout({ voucher_IDs }) {
        try {
            const result = await httpRequest.PATCH(
                "user/checkout/remove-voucher",
                {
                    voucher_IDs,
                }
            );
            return result.data;
        } catch (error) {
            return { error };
        }
    }
}

export default new CheckoutController();

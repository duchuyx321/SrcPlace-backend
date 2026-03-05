import * as httpsRequest from "~/Util/httpsRequest";
class PaymentMethodService {
    // get payment methods
    async getPaymentMethods() {
        try {
            const result = await httpsRequest.GET("payment/payment-methods");
            return result.data;
        } catch (error) {
            return { error };
        }
    }
}

export default new PaymentMethodService();

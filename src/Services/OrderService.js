import * as httpRequest from "~/Util/httpsRequest";

class OrderService {
    // Get Order by id
    async getOrderById(order_ID) {
        try {
            const result = await httpRequest.GET(`user/order/${order_ID}`);
            return result.data;
        } catch (error) {
            console.error(error);
            return { error };
        }
    }
}

export default new OrderService();

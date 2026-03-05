import * as httpsRequest from "~/Util/httpsRequest";

class CartService {
    // get carts
    async getCarts() {
        try {
            const result = await httpsRequest.GET("user/card");
            return result.data;
        } catch (error) {
            console.log(error);
        }
    }
    // addToCart
    async addToCart(project_ID) {
        try {
            const result = await httpsRequest.GET("user/card/add");
            return result.data;
        } catch (error) {
            console.log(error);
            return;
        }
    }
}
export default new CartService();

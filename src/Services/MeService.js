import * as httpRequest from "~/Util/httpsRequest";

class MeService {
    // get profile
    async getProfile() {
        try {
            const result = await httpRequest.GET("user/me");
            return result.data;
        } catch (error) {
            return { error: error.response?.data?.error };
        }
    }
}
export default new MeService();

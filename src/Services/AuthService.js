import * as httpRequest from "~/Util/httpsRequest";

class AuthService {
    // login
    async login({ username, password }) {
        try {
            const result = await httpRequest.POST("auth/register", {
                body: {
                    username,
                    password,
                },
            });
            console.log(result);
            return result.data;
        } catch (error) {
            return { error: error.message };
        }
    }
    // register
    async register({ form = {} }) {
        try {
            const result = await httpRequest.POST("auth/register", form);
            return result.data;
        } catch (error) {
            return { error: error.message };
        }
    }
}
export default new AuthService();

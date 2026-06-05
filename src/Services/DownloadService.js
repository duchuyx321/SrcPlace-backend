import * as httpRequest from "~/Util/httpsRequest";
class DownloadService {
    // Download product by id
    async downloadProductById(product_ID) {
        try {
            await httpRequest.downloadProjectFile(
                `user/download/${product_ID}`
            );
            return { status: "successful" };
        } catch (error) {
            console.error(error);
        }
    }
}

export default new DownloadService();

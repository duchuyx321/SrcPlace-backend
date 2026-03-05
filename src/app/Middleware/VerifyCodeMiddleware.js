const VerifyCodesServices = require('../../services/VerifyCodesServices');

class VerifyCodesMiddleware {
    // check code
    async VerifyCode(req, res, next) {
        try {
            const { user_ID, device_ID } = req.user;
            const { code } = req.body;
            const isToken = await VerifyCodesServices.CheckVerifyCodes({
                code,
                device_ID,
                user_ID,
            });

            if (isToken.status !== 200) {
                // trả về luôn lỗi, không dùng throw ở đây
                return res.status(400).json({ error: isToken.message });
            }
            next();
        } catch (error) {
            console.log(error.message);
            return res.status(501).json({ error: error.message });
        }
    }
}
module.exports = new VerifyCodesMiddleware();

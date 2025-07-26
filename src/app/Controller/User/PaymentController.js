const Projects = require('../../Model/Projects');
const PaymentMethods = require('../../Model/PaymentMethods');

const { decrypt } = require('../../../util/keyUtil');
const PaymentService = require('../../../services/PaymentService');
const VoucherServices = require('../../../services/VoucherServices');
const OrderServices = require('../../../services/OrderServices');

require('dotenv').config();
class PaymentController {
    async createPayment(req, res, next) {
        try {
            const { user_ID } = req.user;
            const { paymentMethod_ID, products } = req.body;
            let vouchers = req.body.vouchers;
            // total products
            const projects = await Projects.find({
                _id: { $in: products },
            }).select('price category_ID');
            let amount = projects.reduce(
                (total, item) => (total += item.price),
                0,
            );
            if (vouchers.length > 0) {
                const { discount, applyVoucher } = await VoucherServices({
                    user_ID,
                    vouchers,
                    projects,
                    amount,
                });
                amount -= discount;
                vouchers = applyVoucher;
            }
            // lấy phương thức thanh toán
            const paymentMethod = await PaymentMethods.findOne({
                _id: paymentMethod_ID,
                // status: 'active',
            }).select('config code');
            // create order
            const order = await OrderServices.createOrder({
                user_ID,
                project_IDs: products,
                price: amount,
                orderable_type: 'e-wallet',
                orderable_ID: paymentMethod._id,
            });
            if (!paymentMethod) {
                return res
                    .status(403)
                    .json({ error: 'Payment method not working!' });
            }
            const { accessKey, secretKey, partnerCode, callbackUrl } =
                paymentMethod.config;
            const decryptAccessKey = await decrypt(accessKey, 'accessKey');
            const decryptSecretKey = await decrypt(secretKey, 'secretKey');
            const decryptPartnerCode = await decrypt(
                partnerCode,
                'partnerCode',
            );
            const timestamp = Date.now();
            const orderInfo = `${paymentMethod.code}_${order.order_ID}_${timestamp}`;
            // khởi tạo thanh toán bằng bên thứ 3
            const paymentFn = PaymentService.gatewayMap(paymentMethod.code);
            if (!paymentFn)
                return res.status(400).json({ error: 'Unsupported gateway' });
            const resultPayment = await paymentFn({
                accessKey: decryptAccessKey,
                secretKey: decryptSecretKey,
                partnerCode: decryptPartnerCode,
                amount,
                orderInfo,
                callback:
                    'https://e76894d227a8.ngrok-free.app/api/payment/callback',
            });
            return res.status(200).json({
                data: {
                    message: 'payment successful',
                    vouchers,
                    resultPayment,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PaymentController();

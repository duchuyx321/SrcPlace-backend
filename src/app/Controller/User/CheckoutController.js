const Checkout = require('../../Model/Checkout');
const Projects = require('../../Model/Projects');
const Vouchers = require('../../Model/Voucher');

class CheckoutController {
    // [GET] --/user/checkout
    async getCheckout(req, res, next) {
        try {
            const { user_ID } = req.user;
            const checkoutUser = await Checkout.findOne({
                user_ID,
                expiresAt: { $gte: new Date() },
            }).select('product_IDs voucher_IDs');
            if (!checkoutUser) {
                return res
                    .status(404)
                    .json({ message: 'No valid checkout data!' });
            }
            const product_IDs = checkoutUser.product_IDs;
            const voucher_IDs = checkoutUser.voucher_IDs;
            const [products, vouchers] = await Promise.all([
                Projects.find({ _id: { $in: product_IDs } }).select(
                    'title thumbnail slug price',
                ),
                Vouchers.find({
                    _id: { $in: voucher_IDs },
                    isActive: true,
                }).select('code voucher_type value'),
            ]);
            return res.status(200).json({ data: { products, vouchers } });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    // [POST] --/user/checkout/add
    async addCheckout(req, res, next) {
        try {
            const { product_IDs, voucher_IDs } = req.body;
            const { user_ID } = req.user_ID;
            const products = await Projects.find({ _id: { $in: product_IDs } });
            const vouchers = await Vouchers.find({ _id: { $in: voucher_IDs } });
            if (!Projects) {
                return res
                    .status(404)
                    .json({ error: 'projects does not exist!' });
            }
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
            const newCheckout = new Checkout({
                user_ID,
                product_IDs: products,
                voucher_IDs: vouchers,
                expiresAt,
            });
            await newCheckout.save();
            return res
                .status(200)
                .json({ data: { message: 'add checkout successful!' } });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    // [PATCH] --/user/checkout/add-voucher
    async addVoucherCheckout(req, res, next) {
        try {
            const { voucher_IDs } = req.body;
            const { user_ID } = req.body;
            if (Array.isArray(voucher_IDs) || voucher_IDs.length === 0) {
                return res.status(403).json({ error: 'no data to upload!' });
            }
            const updateCheckout = await Checkout.updateOne(
                {
                    user_ID,
                },
                {
                    $addToSet: {
                        voucher_IDs: { $each: voucher_IDs },
                    },
                },
            );
            if (updateCheckout.modifiedCount === 0) {
                return res
                    .status(501)
                    .json({ error: 'update voucher in checkout is false!' });
            }
            return res.status(200).json({
                data: {
                    message: 'update voucher in checkout is successful!',
                },
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    // [PATCH] --/user/checkout/remove-voucher
    async removeVoucher(req, res, next) {
        try {
            const { voucher_IDs } = req.body;
            const { user_ID } = req.user;
            if (Array.isArray(voucher_IDs) || voucher_IDs.length === 0) {
                return res.status(403).json({ error: 'no data to upload!' });
            }
            const updateCheckout = await Checkout.updateOne(
                { user_ID },
                { $pull: { voucher_IDs: { $in: voucher_IDs } } },
            );
            if (updateCheckout.modifiedCount === 0) {
                return res
                    .status(501)
                    .json({ error: 'remove voucher in checkout is false!' });
            }
            return res.status(200).json({
                data: {
                    message: 'remove voucher in checkout is successfull',
                },
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    // [DELETE] --/user/checkout/delete
    async deleteCheckout(req, res, next) {
        try {
            const { checkout_IDs } = req.body;
            await Checkout.deleteMany({ _id: { $in: checkout_IDs } });
            return res
                .status(200)
                .json({ data: { message: 'delete checkout is successFul' } });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new CheckoutController();

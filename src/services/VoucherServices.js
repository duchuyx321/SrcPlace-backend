const Vouchers = require('../app/Model/Voucher');
const VoucherUsedBy = require('../app/Model/VoucherUsedBy');
const Payments = require('../app/Model/Payments');
const Users = require('../app/Model/Users');
const dayjs = require('dayjs');
class VoucherServices {
    async validateAndApply({
        user_ID,
        vouchers = [],
        products = [],
        amount = 0,
    }) {
        try {
            let discount = 0;
            let applyVoucher = [];
            for (const code of vouchers) {
                const voucher = await Vouchers.findOne({
                    code,
                    isActive: true,
                }).select('-active -code');
                if (!voucher) throw new Error(`voucher '${code}' not found!`);
                // Kiểm tra thời gian hiệu lực
                if (new Date() > voucher.expiresAt) {
                    throw new Error('voucher is expired!');
                }
                // Kiểm tra lượt sử dụng
                if (
                    !voucher.unlimited &&
                    voucher.maxUsers &&
                    voucher.used > voucher.maxUsers
                ) {
                    throw new Error('voucher is over!');
                }
                // kiểm tra số lượt sử dụng đối với 1 user
                if (!voucher.perUserUnlimited && voucher.maxPerUser) {
                    const userUsed = await VoucherUsedBy.findOne({
                        user_ID,
                        voucher_ID: voucher._id,
                    }).select('countUses');
                    if (userUsed && userUsed.countUses === voucher.maxPerUser) {
                        throw new Error('user reach usage limit!');
                    }
                }
                // Kiểm tra điều kiện đơn hàng
                if (
                    voucher.proviso?.minOrderAmount !== 0 &&
                    amount < voucher.proviso?.minOrderAmount
                ) {
                    throw new Error('products is not not eligible!');
                }
                //  kiểm tra user có được sử dụng
                if (voucher.proviso?.onlyForUserIDs) {
                    const user_IDs = voucher.proviso?.onlyForUserIDs;
                    if (!user_IDs.some((id) => id.equals(user_ID))) {
                        throw new Error('user is not used!');
                    }
                }
                // kiểm tra danh mục được sử dụng
                if (voucher.proviso?.applyToCategories_IDs) {
                    const categories_IDs =
                        voucher.proviso?.applyToCategories_IDs;
                    if (
                        !products.some((item) =>
                            categories_IDs.some((id) =>
                                id.equals(item.category_ID),
                            ),
                        )
                    ) {
                        throw new Error(
                            'voucher is not valid for your products!',
                        );
                    }
                }
                // kiểm tra sản phẩm có thuộc các sản phẩm được áp dụng
                if (voucher.proviso?.applyToProductIDs) {
                    const ProductIDs = voucher.proviso?.applyToProductIDs;
                    if (
                        !products.some((item) =>
                            ProductIDs.some((id) => id.equals(item._id)),
                        )
                    ) {
                        throw new Error('products is not usable!');
                    }
                }
                // kiểm tra đơn hàng đầu tiên
                if (voucher.proviso?.firstTimeUserOnly) {
                    const countPayment = await Payments.countDocuments({
                        user_ID,
                    });
                    if (countPayment > 0) {
                        throw new Error('user is not used');
                    }
                }
                // kiểm tra người dùng mới trong vòng 48h trở lại
                if (voucher.proviso?.newUserOnly) {
                    const user = await Users.findOne({
                        _id: user_ID,
                        is_blocked: false,
                    }).select('createdAt');
                    if (!user) throw new Error('User not found');
                    const hoursPassed = dayjs().diff(
                        dayjs(user.createdAt),
                        'hour',
                    );
                    if (hoursPassed >= 48) {
                        throw new Error('User not used!');
                    }
                }
                // kiểm tra số tiền được giảm
                if (voucher.voucher_type === 'money') {
                    discount += voucher.value;
                } else if (voucher.voucher_type === 'percent') {
                    discount += amount * (voucher.value / 100);
                }
                applyVoucher.push(code);
            }
            discount = Math.min(discount, amount);
            return { discount, applyVoucher };
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}

module.exports = new VoucherServices();

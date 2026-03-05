const Orders = require('../app/Model/Orders');
class OrderService {
    async createOrder({
        user_ID = '',
        payment_ID = null,
        project_IDs = [],
        orderable_type = 'e-wallet',
        orderable_ID = '',
        price = 0,
        status = 'pending',
    } = {}) {
        try {
            const order = {
                user_ID,
                orderable_ID,
                orderable_type,
                project_IDs,
                price,
                status,
            };
            if (payment_ID) {
                order['payment_ID'] = payment_ID;
            }
            const createOrder = new Orders(order);
            await createOrder.save();
            return { order_ID: createOrder._id };
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    async editOrder({
        order_ID = '',
        user_ID = '',
        payment_ID = null,
        project_IDs = [],
        orderable_type = '',
        orderable_ID = '',
        price = 0,
        status = '',
    }) {
        try {
            const update = {
                user_ID,
                payment_ID,
                project_IDs,
                orderable_type,
                orderable_ID,
                price,
                status,
            };
            let edit = {};
            // lấy phần tử
            Object.entries(update).forEach(([key, value]) => {
                if (value) {
                    edit[key] = value;
                }
            });
            if (Object.keys(edit).length === 0) {
                return {
                    status: 403,
                    error: 'not data edit!',
                };
            }
            const editOrder = await Orders.updateOne(
                { _id: order_ID },
                { $set: edit },
            );
            if (editOrder.modifiedCount === 0) {
                throw new Error('edit is failed!');
            }
            return {
                status: 200,
                message: 'edit is successful!',
            };
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    async destroyOrder({ order_IDs = {} }) {
        try {
            await Orders.deleteMany({ _id: { $in: order_IDs } });
            return { status: 200, message: 'delete is successful!' };
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}
module.exports = new OrderService();

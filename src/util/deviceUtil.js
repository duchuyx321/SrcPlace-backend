const { v4: uuidv4 } = require('uuid');

const newDeviceID = async () => {
    const device_ID = await uuidv4();
    return device_ID;
};
module.exports = { newDeviceID };

const bcryptjs = require('bcryptjs');
require('dotenv').config();

const hashPassword = async (password) => {
    const salt = bcryptjs.genSaltSync(parseInt(process.env.SALT_ROUNDS));
    const hash = bcryptjs.hashSync(password, salt);
    return hash;
};

const comparePassword = async (password, hashPass) => {
    const is_Pass = bcryptjs.compareSync(password, hashPass);
    return is_Pass;
};

module.exports = { hashPassword, comparePassword };

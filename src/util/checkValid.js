const regexCheckValid = {
    email: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
    password: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
};

const checkValid = async ({
    type = '',
    valid = '',
    min = 6,
    max = 20,
} = {}) => {
    if (valid.length < min || valid.length > max) {
        return {
            status: 401,
            message: `${type} invalid character length!`,
        };
    }
    const regex = await regexCheckValid[type];
    if (regex && !regex.test(valid)) {
        const message = `${type} is not valid.`;
        return {
            status: 401,
            message,
        };
    }
    return {
        status: 200,
        message: `${type} is valid.`,
    };
};
const validateField = async ({ type, valid, min, max }) => {
    const result = await checkValid({ type, valid, min, max });

    if (result.status !== 200) {
        throw new Error(result.message);
    }
};

module.exports = { checkValid, validateField };

const listNumber = '123456789';
const listString = 'qwertyuiopasdfghjklzxcvbnm';
const newCode = async ({ length = 6, isUpLower = true } = {}) => {
    let code = '';
    const listCustom = listNumber + listString;
    for (let i = 0; i < length; i++) {
        let radomIndex = Math.floor(Math.random() * listCustom.length);
        code += listCustom[radomIndex];
    }

    return isUpLower ? code.toUpperCase() : code;
};

module.exports = { newCode };

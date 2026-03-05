const { override, useBabelRc } = require("customize-cra");

module.exports = override(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc()
); // nhận cấu hình webpack để ghi đè

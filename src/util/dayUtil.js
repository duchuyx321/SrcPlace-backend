const dayjs = require('dayjs');

const getStartEndDate = (year) => {
    const startDate = dayjs().year(year).startOf(year).toDate();
    const endDate = dayjs().year(year).endOf(year).toDate();
    return { startDate, endDate };
};

module.exports = { getStartEndDate };

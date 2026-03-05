import dayjs from "dayjs";

const formatDay = (date) => {
    return dayjs(date).format("DD/MM/YYYY");
};

export { formatDay };

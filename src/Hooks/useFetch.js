import { useEffect } from "react";
import PropTypes from "prop-types";

const defaultFnc = () => {};
function useFetch({ handleOnInside = defaultFnc, isFetchedList = [] }) {
    useEffect(() => {
        const accessToken = localStorage.getItem("AccessToken");

        const shouldFetch = isFetchedList.every((val) => val === false);

        if (accessToken?.startsWith("Bearer") && shouldFetch) {
            handleOnInside();
        }
    }, isFetchedList);
}
useFetch.propTypes = {
    handleOnInside: PropTypes.func,
    isFetchedList: PropTypes.array,
};
export default useFetch;

import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";

import style from "./UserActions.module.scss";

import Notify from "./Notify";
import Shopping from "./Shopping";

const cx = classNames.bind(style);

function UserActions() {
    useEffect(() => {
        const accessToken = localStorage.getItem("AccessToken");
        if (accessToken && accessToken.startsWith("Bearer")) {
            // call api
        }
    }, []);
    return (
        <div className={cx("wrapper")}>
            <Notify />
            <Shopping />
        </div>
    );
}

export default UserActions;

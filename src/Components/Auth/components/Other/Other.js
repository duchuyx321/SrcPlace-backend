import classNames from "classnames/bind";
import { AiFillGoogleCircle } from "react-icons/ai";
import { BiLogoFacebookCircle } from "react-icons/bi";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/dist/backdrop.css";
import "tippy.js/animations/scale.css";

import style from "./Other.module.scss";

const cx = classNames.bind(style);
const MenuOther = [
    {
        name: "Google",
        icon: <AiFillGoogleCircle />,
    },
    {
        name: "Facebook",
        icon: <BiLogoFacebookCircle />,
    },
];

function Other() {
    const handleOnClick = (name) => {
        const method = name.toLowerCase();
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            `${process.env.REACT_APP_URL_SERVER}auth/${method}`,
            "_blank",
            `width=${width},height=${height},top=${top},left=${left}`
        );
        // Bắt token trả về từ backend qua postMessage
        const receiveMessage = (event) => {
            const expectedOrigin = process.env.REACT_APP_URL_SERVER.replace(
                /\/$/,
                ""
            );
            if (event.origin !== expectedOrigin) return;
            const { AccessToken } = event.data;
            if (AccessToken) {
                localStorage.setItem("AccessToken", AccessToken);
                window.removeEventListener("message", receiveMessage);
                popup?.close();
                window.location.reload();
            }
        };
        window.addEventListener("message", receiveMessage);
    };
    return (
        <div className={cx("wrapper")}>
            {MenuOther.map((item, index) => (
                <Tippy
                    key={index}
                    arrow={true}
                    animation="scale"
                    content={item.name}
                    duration={[500, 0]}
                    theme={item.name.toLowerCase()}
                >
                    <button
                        className={cx("btn_other", item.name)}
                        onClick={() => handleOnClick(item.name)}
                    >
                        {item.icon}
                    </button>
                </Tippy>
            ))}
        </div>
    );
}

export default Other;

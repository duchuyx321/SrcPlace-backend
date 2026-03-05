import classNames from "classnames/bind";
import { FaPhone, FaFacebookF, FaYoutube } from "react-icons/fa6";
import { IoMailSharp } from "react-icons/io5";
import { RiMapPin2Fill } from "react-icons/ri";

import style from "./Footer.module.scss";
import Session from "./Components/Session";
import image from "~/Assets/images";
import config from "~/Config";

const cx = classNames.bind(style);

const MenuFooter = [
    {
        title: "Liên Hệ",
        methods: [
            {
                leftIcon: <FaPhone />,
                title: "+84 355788176",
            },
            {
                leftIcon: <IoMailSharp />,
                title: "srcplacex321@gmail.com",
            },
            {
                leftIcon: <RiMapPin2Fill />,
                title: "Đà Nẵng - Việt Nam",
            },
        ],
    },
    {
        title: "Mạng Xã Hội",
        methods: [
            {
                leftIcon: <FaFacebookF />,
                title: "Đức Huy",
                href: "https://www.facebook.com/duchuyx321",
            },
            {
                leftIcon: <FaYoutube />,
                title: "SrcPlace Official",
                href: "https://www.facebook.com/duchuyx321",
            },
            {
                leftIcon: <FaPhone />,
                title: "Zalo: Đức Huy",
                href: "https://zalo.me/0355788176",
            },
        ],
    },
    {
        title: "Về Chúng Tôi",
        description:
            "SrcPlace là nền tảng uy tín chuyên cung cấp dịch vụ thực hiện đồ án theo yêu cầu, " +
            "đảm bảo tính bảo mật và chất lượng cao.",
        methods: [
            {
                src: image.logoWhiteImage,
                alt: "Ảnh Logo SrcPlace",
                title: "SrcPlace",
                to: config.routers.home,
            },
        ],
    },
];

function Footer() {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("container")}>
                {MenuFooter.map((item, index) => (
                    <Session
                        key={index}
                        title={item.title}
                        description={item.description}
                        items={item.methods}
                    />
                ))}
            </div>
            <div className={cx("auth")}>
                <span>
                    &copy; 2025 <strong>SrcPlace</strong> — Keep learning. Keep
                    growing.
                </span>
            </div>
        </div>
    );
}

export default Footer;

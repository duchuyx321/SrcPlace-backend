import classNames from "classnames/bind";
import { Link } from "react-router-dom";

import style from "./NotFund.module.scss";
import Seo from "~/Components/Seo";

const cx = classNames.bind(style);

function NotFund() {
    return (
        <>
            <Seo
                title="404 - Trang Không Tồn Tại"
                description="Đây là trang 404 của SrcPlace"
                noIndex={false}
            />
            <div className={cx("wrapper")}>
                <main className={cx("page_notFund")}>
                    <h2>404 Page</h2>
                    <div className={cx("container")}>
                        <h3>Trang Không tồn tại</h3>
                        <p>
                            Nếu bạn quan tâm đến chúng tôi vui lòng click vào
                            nút bên dưới
                        </p>
                        <div>
                            <Link to={"/"} className={cx("btn_home")}>
                                Về Trang Chủ
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default NotFund;

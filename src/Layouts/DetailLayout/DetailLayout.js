import classNames from "classnames/bind";
import PropTypes from "prop-types";

import style from "~/Layouts/DetailLayout/DetailLayout.module.scss";
import Header from "~/Layouts/Components/Header";
import Footer from "~/Layouts/Components/Footer";
import SidebarDetail from "~/Layouts/Components/SidebarDetail";

const cx = classNames.bind(style);

function DetailLayout({
    children,
    isNoSidebar = false,
    isNoSidebarMobile = false,
}) {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("wrapper")}>
                <header className={cx("header")}>
                    <Header />
                </header>
                <div className={cx("container")}>
                    {!isNoSidebar && (
                        <aside className={cx("sidebar")}>
                            <SidebarDetail />
                        </aside>
                    )}
                    <div className={cx("body")}>
                        <main className={cx("content", { isNoSidebar })}>
                            {children}
                        </main>
                    </div>
                    <footer
                        className={cx("footer", {
                            isNoSidebarMobile: isNoSidebarMobile,
                        })}
                    >
                        <Footer />
                    </footer>
                </div>
            </div>
        </div>
    );
}
DetailLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
export default DetailLayout;

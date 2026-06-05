import classNames from "classnames/bind";

import style from "./EmptyLayout.module.scss"

const cx = classNames.bind(style);

function EmptyLayout({children}) {
    return ( 
        <div className={cx("wrapper")}>
            {children}
        </div>
     );
}

export default EmptyLayout;
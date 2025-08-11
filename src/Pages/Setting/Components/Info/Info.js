import classNames from 'classnames/bind';

import style from './info.module.scss';

const cx = classNames.bind(style);

function Info() {
    return <div className={cx('wrapper')}>Thông tin cá nhân</div>;
}

export default Info;

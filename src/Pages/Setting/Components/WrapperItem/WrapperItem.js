import classNames from 'classnames/bind';

import style from './WrapperItem.module.scss';
import ButtonInfo from '../ButtonInfo';

const cx = classNames.bind(style);

function WrapperItem({ item = {} }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
            </div>
            <div className={cx('container')}>
                <ButtonInfo items={item.items} />
            </div>
        </div>
    );
}

export default WrapperItem;

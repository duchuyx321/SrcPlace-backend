import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { FaAngleRight } from 'react-icons/fa6';

import style from './ButtonInfo.module.scss';
import Image from '~/Components/Image';
import images from '~/Assets/images';

const cx = classNames.bind(style);

function ButtonInfo({ items = [] }) {
    return (
        <div className={cx('wrapper')}>
            {items.map((item) => (
                <button key={item.id} className={cx('btn_item')}>
                    <h3 className={cx('name_item')}>{item?.name}</h3>
                    {item.id !== 'avatar' && (
                        <p className={cx('content_item')}>
                            {item.id === 'fullName'
                                ? item?.firstName + ' ' + item?.lastName
                                : item?.content}
                        </p>
                    )}
                    {item.id === 'avatar' && (
                        <span className={cx('image_item')}>
                            <Image
                                src={item?.image_url || images.noAvatar}
                                alt={`Ảnh đại diện của ${item?.firstName} ${item?.lastName}`}
                            />
                        </span>
                    )}
                    <span className={cx('icon_item')}>
                        <FaAngleRight />
                    </span>
                </button>
            ))}
        </div>
    );
}

ButtonInfo.propTypes = {
    item: PropTypes.array,
};

export default ButtonInfo;

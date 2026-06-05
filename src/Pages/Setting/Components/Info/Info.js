import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import style from './info.module.scss';
import WrapperItem from '../WrapperItem';

const cx = classNames.bind(style);

function Info() {
    const [resultInfo, setResultInfo] = useState({});
    useEffect(() => {
        const fetchApi = async () => {};

        //  call api
    }, []);
    const MenuInfo = [
        {
            title: 'Thông tin cá nhân',
            description:
                'SrcPlace sử dụng thông tin này để xác minh danh tính của bạn và bảo vệ cộng đồng của chúng tôi.' +
                'Bạn là người quyết định những thông tin cá nhân nào sẽ hiển thị với người khác.',
            items: [
                {
                    id: 'fullName',
                    name: 'Tên đầy đủ',
                    firstName: 'Đức',
                    lastName: 'Huy',
                    description:
                        'Khi thay đổi username nằn trong khoản từ 6-20 kí tự và không trù với tên cũ',
                },
                {
                    id: 'username',
                    name: 'Tên người dùng',
                    content: resultInfo?.username || 'duchuyx321',
                    description:
                        'Khi thay đổi username nằn trong khoản từ 6-20 kí tự và không trù với tên cũ',
                },
                {
                    id: 'email',
                    name: 'Email',
                    content: resultInfo?.email || 'duchuyx321@gmail.com',
                    description:
                        'Khi thay đổi username nằn trong khoản từ 6-20 kí tự và không trù với tên cũ',
                },
                {
                    id: 'avatar',
                    name: 'Ảnh đại diện',
                    image_url: resultInfo?.thubmail?.image_url,
                    description:
                        'Khi thay đổi username nằn trong khoản từ 6-20 kí tự và không trù với tên cũ',
                },
            ],
        },
    ];
    return (
        <div className={cx('wrapper')}>
            {MenuInfo.map((item, index) => (
                <>
                    <WrapperItem key={index} item={item} />
                </>
            ))}
        </div>
    );
}

export default Info;

import classNames from 'classnames/bind';
import { FaUser, FaShield } from 'react-icons/fa6';

import style from './Dashboard.module.scss';
import Button from '~/Components/Button';

const cx = classNames.bind(style);
const MenuSeting = [
    {
        id: 'info',
        title: 'Thông tin cá nhân',
        leftIcon: <FaUser />,
    },
    {
        id: 'security',
        title: 'Mật khẩu và bảo mật',
        leftIcon: <FaShield />,
    },
];
const defaultFnc = () => {};

function Dashboard({ currentTab = '', handleOnClickTab = defaultFnc }) {
    return (
        <div className={cx('wrapper')}>
            {MenuSeting.map((item) => (
                <Button
                    text
                    key={item.id}
                    leftIcon={item.leftIcon}
                    className={cx('item_dashboard', {
                        active: item.id === currentTab,
                    })}
                    onClick={() => handleOnClickTab(item.id)}
                >
                    {item.title}
                </Button>
            ))}
        </div>
    );
}

export default Dashboard;

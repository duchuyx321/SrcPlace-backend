import classNames from 'classnames/bind';

import style from './Setting.module.scss';

import { useState } from 'react';
import Info from './Components/Info';
import Dashboard from './Components/Dashboard';

const cx = classNames.bind(style);

function Setting() {
    const [menuTab, setMenuTab] = useState('info');
    const handleOnClickTab = (tab) => {
        setMenuTab(tab);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('dashboard')}>
                <Dashboard
                    currentTab={menuTab}
                    handleOnClickTab={handleOnClickTab}
                />
            </div>
            <div className={cx('content')}>
                {menuTab === 'info' && <Info />}
            </div>
        </div>
    );
}

export default Setting;

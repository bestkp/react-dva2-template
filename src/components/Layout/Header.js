import React from 'react'
import PropTypes from 'prop-types'
import {Menu, Icon, Dropdown} from 'antd'
import styles from './Header.less'
import config from 'config'

const {localStName} = config

const SubMenu = Menu.SubMenu

const Header = ({logout}) => {
    let handleClickMenu = e => e.key === 'logout' && logout()

    const user = window.localStorage.getItem(localStName.name)
    const menu = (
        <Menu onClick={handleClickMenu}>
            <Menu.Item key="logout">
                退出登录
            </Menu.Item>
        </Menu>
    )
    return (
        <div className={styles.header}>
            <div></div>
            <div className={styles.rightWarpper}>
                <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
                    <span><Icon type="user"/>{user}</span>
                </Dropdown>
            </div>
        </div>
    )
}

Header.propTypes = {
    logout: PropTypes.func,
    location: PropTypes.object,
    switchMenuPopover: PropTypes.func,
}

export default Header

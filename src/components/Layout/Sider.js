import React from 'react'
import PropTypes from 'prop-types'
import { config } from 'utils'
import {SideMenu} from 'components'
import styles from './Sider.less'
import avator from '../../public/avator.svg'

const Sider = ({ location, user, logo, menuList, updateState,selectedKeys, navOpenKeys, changeOpenKeys, dispatch, logout }) => {
    const menusProps = {
        menuList,
        location,
        updateState,
        selectedKeys,
        navOpenKeys,
        changeOpenKeys,
        dispatch,
    }
    return (
        <div className={styles.sider}>
            <div className={styles.logo}>
	            <img src={logo} alt=""/>
            </div>
	        <div className={styles.user} onClick={logout}>
		        <img src={avator} alt=""/>
		        <p>{user}</p>
	        </div>
	        <SideMenu {...menusProps}></SideMenu>
        </div>
    )
}

Sider.propTypes = {
    location: PropTypes.object,
}

export default Sider

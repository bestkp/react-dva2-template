import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { queryArray } from 'utils'
import flattenOptions from 'utils/flattenOptions'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import styles from './menu.less'

const Menus = ({ navOpenKeys, changeOpenKeys, location, menuList, dispatch }) => {
    const pathname = location.pathname
    const newPath = (/^\D+(?=\d)/.exec(pathname))? (/^\D+(?=\d)/.exec(pathname))[0] : pathname
    const router_pathname = newPath.indexOf('/detail') > 0 ? newPath.indexOf('/detail') : newPath.length
    const menu = flattenOptions(menuList)
    // 生成树状
    const menuTree = menuList
    const levelMap = {}
    // 递归生成菜单
    const linkTo = (pathname) => {
        dispatch({ type: 'app/updateState', payload: {
            cache: {}
        }})
        window.location.hash.slice(1) !== pathname && dispatch(routerRedux.replace({
            pathname,
        }))
    }
    const getMenus = (menuTreeN) => {
        return menuTreeN.map((item) => {
            if (item.children) {
                if (item.fid) {
                    levelMap[item.id] = item.fid
                }
                return (
                    <Menu.SubMenu
                        key={item.id}
                        title={<span>
                            {item.icon && <Icon type={item.icon} />}
                            {item.title}
                        </span>}
                    >
                        {getMenus(item.children)}
                    </Menu.SubMenu>
                )
            }
            return (
                <Menu.Item key={item.id}>
                    <a onClick={() => linkTo(item.route)} data={item.route}>
                        {item.icon && <Icon type={item.icon} />}
                        {item.title}
                    </a>
                </Menu.Item>
            )
        })
    }
    const menuItems = getMenus(menuTree)

    // 保持选中
    const getAncestorKeys = (key) => {
        let map = {}
        const getParent = (index) => {
            const result = [String(levelMap[index])]
            if (levelMap[result[0]]) {
                result.unshift(getParent(result[0])[0])
            }
            return result
        }
        for (let index in levelMap) {
            if ({}.hasOwnProperty.call(levelMap, index)) {
                map[index] = getParent(index)
            }
        }
        return map[key] || []
    }

    const onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => !navOpenKeys.includes(key))
        const latestCloseKey = navOpenKeys.find(key => !openKeys.includes(key))
        let nextOpenKeys = []
        if (latestOpenKey) {
            nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
        }
        if (latestCloseKey) {
            nextOpenKeys = getAncestorKeys(latestCloseKey)
        }
        changeOpenKeys(nextOpenKeys)
    }

    let menuProps = {
        onOpenChange,
        openKeys: navOpenKeys,
    }


    // 寻找选中路由
    let currentMenu
    let defaultSelectedKeys
    for (let item of menu) {
        if (item.route && pathToRegexp(item.route).exec(location.pathname.substring(0, router_pathname))) {
            currentMenu = item
            break
        }
    }
    const getPathArray = (array, current, pid, id) => {
        let result = [String(current[id])]
        const getPath = (item) => {
            if (item && item[pid]) {
                result.unshift(String(item[pid]))
                getPath(queryArray(array, item[pid], id))
            }
        }
        getPath(current)
        return result
    }
    if (currentMenu) {
        defaultSelectedKeys = getPathArray(menu, currentMenu, 'fid', 'id')
    }

    if (!defaultSelectedKeys) {
        defaultSelectedKeys = ['1']
    }

    return (
        <div className={styles.menuContainer}>
            <Menu
                {...menuProps}
                mode='inline'
                selectedKeys={defaultSelectedKeys}
            >
                {menuItems}
            </Menu>
        </div>
    )
}

Menus.propTypes = {
    navOpenKeys: PropTypes.array,
    changeOpenKeys: PropTypes.func,
    location: PropTypes.object,
}

export default Menus

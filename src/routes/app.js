/* global window */
import React from 'react'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {Layout, Loader, Modal} from 'components'
import {classnames, config, showBread} from 'utils'
import {Helmet} from 'react-helmet'
import {withRouter} from 'dva/router'
import '../themes/index.less'
import './app.less'
import logo from '../public/logo.svg'

const {prefix, openPages} = config

const {Header, Bread, Sider, styles} = Layout
let lastHref

const App = ({children, dispatch, app, loading, location}) => {
    const {menuList = [], selectedKeys = ['1'], navOpenKeys = ["0", "1"], loginShow} = app || {}
    let {pathname} = location
    pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
    const {iconFontJS, iconFontCSS} = config
    const href = window.location.href

    if (lastHref !== href) {
        NProgress.start()
        if (!loading.global) {
            NProgress.done()
            lastHref = href
        }
    }

    const headerProps = {
        logout() {
            dispatch({type: 'app/logout'})
        },
    }

    const siderProps = {
        location,
	    logo,
	    user: window.localStorage.getItem(config.localStName.name),
        menuList,
        selectedKeys,
        navOpenKeys,
        dispatch,
        updateState(payload) {
            dispatch({type: 'app/updateState', payload})
        },
        changeOpenKeys(openKeys) {
            window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
            dispatch({type: 'app/handleNavOpenKeys', payload: {navOpenKeys: openKeys}})
        },
	    logout() {
            dispatch({
	            type: 'app/updateState',
	            payload: {
	            	loginShow: true,
	            }
            })
	    }
    }
    const onCancle = () => {
    	dispatch({
		    type: 'app/updateState',
		    payload: {
		    	loginShow: false,
		    }
	    })
	}
	const onOk = () => {
        dispatch({
	        type: 'app/doLogout',
        })
	}
    
    const breadProps = {
        menuList,
        location,
	    back() {
        	dispatch(routerRedux.goBack())
	    }
    }

    if (openPages && openPages.includes(pathname)) {
        return (<div>
            <Loader fullScreen spinning={loading.effects['app/loading']}/>
            {children}
        </div>)
    }

    return (
        <div>
            <Loader fullScreen spinning={loading.effects['app/loading', 'app/getSysMenuList']}/>
            <Helmet>
                <title>dva2.0</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link rel="icon" href={logo} type="image/x-icon"/>
                {iconFontJS && <script src={iconFontJS}/>}
                {iconFontCSS && <link rel="stylesheet" href={iconFontCSS}/>}
            </Helmet>
            <div className={styles.layout}>
                <aside className={styles.sider}>
                    {siderProps.menuList.length === 0 ? null : <Sider {...siderProps} />}
                </aside>
                <div className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.content}>
	                        {showBread(menuList, pathname) && <Bread {...breadProps} />}
                            {children}
                        </div>
                    </div>
                </div>
            </div>
	        <Modal
	            title="退出"
	            visible={loginShow}
	            width={380}
	            onCancle={onCancle}
	            onOk={onOk}
	        >
		        确定退出系统？
	        </Modal>
        </div>
    )
}

App.propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    app: PropTypes.object,
    loading: PropTypes.object,
}

export default withRouter(connect(({app, loading}) => ({app, loading}))(App))

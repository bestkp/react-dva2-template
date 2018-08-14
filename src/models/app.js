/* global window */
/* global document */
/* global location */
import {routerRedux} from 'dva/router'
import {parse} from 'qs'
import config from 'config'
import {menuList} from '../common'
import {getUserInfo, validToken, getDeparts, classifyList, tagListInfo, userListInfo, getStatusListNumber, userListMenuInfo} from 'services/app'
import queryString from 'query-string'
import {message} from 'antd'

const urlSuffix = "?followup=1&sign=26&sid=6";  //单点登录的oncall平台相关信息
// http://10.6.27.122:8081/login?callback=http://localhost:8000/index.html?followup=1&sign=26&sid=6
const {prefix, localStName} = config

export default {
    namespace: 'app',
    state: {
    	loginShow: false,
        locationPathname: '',
        locationQuery: {},
        selectedKeys: ['1'],
        navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || ["0", "1"],
        cache: {},
	    departList: [],
	    classifyList: {},
	    tagListInfo: {},
	    userListInfo: [],
	    isAdmin: '0', //是否管理员
	    isManger: '0', //是否领导
	    userList: '',  //工单管理搜索处理人
	    trickStatus: '', //工单管理列表tabs 数量
	    group_code: '', // 部门code
	    menuList: [],
	    userId: 0
    },
    subscriptions: {
        setupHistory({dispatch, history}) {
            history.listen((location) => {
                dispatch({
                    type: 'updateState',
                    payload: {
                        locationPathname: location.pathname,
                        locationQuery: queryString.parse(location.search),
                    },
                })
            })
        },

        setup({dispatch, history}) {
	        const auth = queryString.parse(window.location.search).auth;
	        if(auth) {
		         window.localStorage.setItem(localStName.token, auth);
		         window.location.href=window.location.origin;
	        }
	        dispatch({
                type: 'getSysMenuList',
                payload: {pathname: history.location.pathname}
            })
        },
    },
    effects: {
        * getSysMenuList({payload}, {call, put}) {
            const localToken = payload && payload.token || window.localStorage.getItem(localStName.token)
            if (localToken) {
	            const {code, data} = yield call(getUserInfo, {token: localToken})
	            if(code === '200') {
		            window.localStorage.setItem(localStName.name, data.username);
		            window.localStorage.setItem(localStName.email, data.email);
	            } else {
	            	message.error('账户已过期')
		            yield put({type: 'doLogout', payload: {}})
	            }
	            yield put({
		            type: 'getDeparts',
		            payload: {
			            _timestamp: new Date().getTime(),
			            _url: '/api/ticket/getGroup',
			            _token: localToken
		            }
	            })
	            yield put({type: 'userListMenuInfo',payload: {}})
	            yield put({type: 'classifyList',payload: {}})
	            yield put({type: 'tagListInfo', payload: {}})
	            yield put({type: 'userListInfo', payload: {}})
	            yield put({type: 'getStatusListNumber', payload: {}})
            } else {
	            yield put({type: 'doLogout', payload: {}})
            }
        },
	    // 获取部门
		*getDeparts({payload}, {call, put}) {
			const {code, data, msg} = yield call(getDeparts, payload)
			if(code === '200') {
				yield put({
					type: 'updateState',
					payload: {
						departList: data
					}
				})
			} else {
				message.error(msg);
			}
		},
	    // 工单类型详情
	    *getStatusListNumber({payload}, {call, put}) {
		    const {code, data, msg} = yield call(getStatusListNumber, payload)
		    if(code === '200') {
			    yield put({
				    type: 'updateState',
				    payload: {
					    isAdmin: data[0].isAdmin,
					    isManger: data[0].isManger,
					    userList: data[0].userList,
					    group_code: data[0].group_code,
					    userId: data[0].userId,
				    }
			    })
		    } else {
			    message.error(msg);
		    }
	    },
	    // 获取菜单
	    *userListMenuInfo({payload}, {call, put}) {
		    const {code, data, msg} = yield call(userListMenuInfo, payload)
		    if(code === '200') {
			    yield put({
				    type: 'updateState',
				    payload: {
					    menuList: data
				    }
			    })
		    } else {
			    message.error(msg);
		    }
	    },
	    // 获取工单类型
	    *classifyList({payload}, {call, put}) {
		    const {code, data, msg} = yield call(classifyList, payload)
		    if(code === '200') {
			    yield put({
				    type: 'updateState',
				    payload: {
					    classifyList: data
				    }
			    })
		    } else {
			    message.error(msg);
		    }
	    },
	    // 获取工单问题
	    *tagListInfo({payload}, {call, put}) {
		    const {code, data, msg} = yield call(tagListInfo, payload)
		    if(code === '200') {
			    yield put({
				    type: 'updateState',
				    payload: {
					    tagListInfo: data
				    }
			    })
		    } else {
			    message.error(msg);
		    }
	    },
	    // 获取处理人列表
	    *userListInfo({payload}, {call, put}) {
		    const {code, data, msg} = yield call(userListInfo, payload)
		    if(code === '200') {
			    yield put({
				    type: 'updateState',
				    payload: {
					    userListInfo: data
				    }
			    })
		    } else {
			    message.error(msg);
		    }
	    },
        * doLogout({payload}, {put}) {
	        const origin = window.location.origin;
	        window.localStorage.clear();
            yield put({type: 'updateState', payload: {navOpenKeys: ['0', '1']}})
	        window.location.href=`${SSOAPI}/logout?callback=${origin}/index.html${urlSuffix}`;
        },

        * loading() {
            yield new Promise((resolve) => setTimeout(resolve, 0));
        }
    },
    reducers: {
        updateState(state, {payload}) {
            return {
                ...state,
                ...payload,
            }
        },
        handleNavOpenKeys(state, {payload: navOpenKeys}) {
            return {
                ...state,
                ...navOpenKeys,
            }
        },
    },
}

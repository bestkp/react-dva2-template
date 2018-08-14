import { routerRedux } from 'dva/router'
import { login } from 'services/login'
import config from 'config'
import {message} from 'antd'

export default {
    namespace: 'login',

    state: {
        errorMsg: '',
        isShowCodeBtn: false,
        checkToken: '',
        token: '',
        isLoginByMsg: false,
    },

    effects: {
        * login({payload}, {put, call, select}) {
            const {code, data, message:msg} = yield call(login, Object.assign({}, payload, {mid: config.mid}))
            const { locationQuery } = yield select(_ => _.app)
            if (code === 200) {
                window.localStorage.setItem(config.localStName.token, data.token)
                window.localStorage.setItem(config.localStName.name, data.name)
                window.localStorage.setItem(config.localStName.phone, data.phone)
                const { from } = locationQuery
                // 请求menulist
                yield put({type: 'app/getSysMenuList', payload: {token: data.token, pathname: '/login'}})
                // if (from && from !== '/login') {
                //     yield put(routerRedux.push(from))
                // } else {
                //     yield put(routerRedux.push('/operation/daily'))
                // }
            } else {
                yield put({
                    type: 'updateState',
                    payload: code === 401 ? {
                        errorMsg: msg,
                        checkToken: data.checkToken,
                        isShowCodeBtn: true
                    } : {errorMsg: msg},
                })
            }
        },

        * getMsgCode({payload}, {put, call}) {
            const {code, data, msg} = yield call(getMsgCode, payload)
            if (code === 200) {
                yield put({
                    type: 'updateState',
                    payload: {isShowCodeBtn: false, isLoginByMsg: true, errorMsg: ''},
                })
                Modal.success({title: '短信发送成功', content: '请查看手机，输入验证重新登陆！'})
            } else {
                Modal.error({title: '短信发送失败', content: data.msg})
            }
        },
    },    
    reducers: {
        updateState(state, {payload}) {
            return {
                ...state,
                ...payload,
            }
        },
    },
}

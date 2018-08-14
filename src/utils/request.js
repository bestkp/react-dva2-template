/**
 * Create by zhangpengchuan on 2017/10/18
 */
import FormData from 'form-data'
import 'whatwg-fetch'
import config from 'config'
import { message, Modal } from 'antd'
import { routerRedux } from 'dva/router'

function checkStatus (response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    }
    const error = new Error(response.statusText)
    error.response = response
    throw error
}

function parseJSON (response) {
    return response.json()
}

export default function request (url, options) {
	let token = options.body['token']? options.body['token']:
		encodeURIComponent(window.localStorage.getItem(config.localStName.token)) || ''
		options.body['token'] = token;
    return new Promise((resolve, reject) => {
        let opt = {}
        if (options.method.toUpperCase() === 'POST') {
            let body = new FormData()
            Object.keys(options.body).forEach(key => body.append(key, options.body[key]))

            opt = {
                ...options,
                method: options.method,
                headers: { ...options.headers },
                body,
            }
        } else {
            const query = Object
                .keys(options.body)
                .map(key => `${key}=${encodeURIComponent(options.body[key])}`)
                .join('&')
            url += `?${query}`
        }
        return fetch(url, opt)
            .then(checkStatus)
            .then(parseJSON)
            .then((response) => {
                if(response.msg=== 'token无权限' || response.code === 401) {
                    window.localStorage.removeItem(config.localStName.token)
                    window.localStorage.removeItem('adminnavOpenKeys')
                }
                resolve(response)
            })
            .catch((err) => {
                resolve({ msg: '请求发送失败, 请检查网络原因或联系研发人员' })
            })
    })
}

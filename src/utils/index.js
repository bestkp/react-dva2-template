/* global window */
import classnames from 'classnames'
import lodash from 'lodash'
import config from './config'
import request from './request'
import renderForm from './renderForm'
import { color } from './theme'

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
    return this.replace(/-(\w)/g, (...args) => {
        return args[1].toUpperCase()
    })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
    return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
    const o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'H+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds(),
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
        }
    }
    return format
}


/***
 * 将url中search返回object
 * @param search
 * @returns {Object}
 */
const queryUrl = (search) => {
	let theRequest = {};
	let str = search.substr(1);
	let strs = str.split("&");
	for(let i = 0; i < strs.length; i ++) {
		theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
	}
	return theRequest;
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
    if (!(array instanceof Array)) {
        return null
    }
    const item = array.filter(_ => _[keyAlias] === key)
    if (item.length) {
        return item[0]
    }
    return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
    let data = lodash.cloneDeep(array)
    let result = []
    let hash = {}
    data.forEach((item, index) => {
        hash[data[index][id]] = data[index]
    })

    data.forEach((item) => {
        let hashVP = hash[item[pid]]
        if (hashVP) {
            !hashVP[children] && (hashVP[children] = [])
            hashVP[children].push(item)
        } else {
            result.push(item)
        }
    })
    return result
}
/***
 *
 * @param menulist
 * @param pathname
 * @returns {boolean}
 */
const showBread = (menulist, pathname) => {
	for(let i=0, mlen=menulist.length; i<mlen; i++) {
		if(menulist[i]['route'] === pathname) {
			return false;
		}
	}
	return true;
}

module.exports = {
    config,
    request,
    color,
    classnames,
    queryUrl,
    queryArray,
    arrayToTree,
	showBread,
	renderForm
}

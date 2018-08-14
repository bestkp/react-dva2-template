import {message} from 'antd'
import {routerRedux} from 'dva/router'
import {getTagsListInfo, classifyAdd, classifyEdit, updateTagEdit, delTags} from 'services/classify'
import {getStatusListNumber} from 'services/app'

export default {
    namespace: 'classify',

    state: {
	    classifyList: [],
	    total: 0,
	    current: 1,
	    per_page: 10,
	    search: {},
	    modalVisible: false,
	    modalVisibleList: false,
	    trickId: '-1',
	    info: {
		    data_type:  '', //部门
		    tag_class: '0', //工单标签
		    describe: '', //问题描述
		    name: '', //描述
		    mon: '0',
		    tue: '0',
		    wed: '0',
		    thu: '0',
		    fri: '0',
		    sat: '0',
		    sun: '0',
	    }
    },
	subscription: {
        setup({dispatch}) {
	
		}
  
	},
    effects: {
        *getTagsListInfo({payload}, {put, call, select}) {
        	const {per_page, current, search} = yield select(state => state.classify)
	        let department = "0"
	        if(!search.ticket_type) { //不带搜索时 需要单独去请求默认部门code
		        const result = yield call(getStatusListNumber, {});
		        if(result.code === '200') {
			        const {group_code, isAdmin, isManger} = result.data[0]
			        department = isAdmin === '1' ? "0": group_code;
		        }
		        
	        }
	        const {code, data, msg} = yield call(getTagsListInfo, {
		        page: payload.current || current,
		        limit: per_page,
		        department: search.ticket_type || department,
		        tag_class: search.classify_id || '0',
		        tag_id: search.tag_id || '0',
		        work_user_id: search.work_user_id || '0'
	        })
	        if(code === '200') {
		        yield put({
			        type: 'updateState',
			        payload: {
				        classifyList: data.list,
				        total: data.total,
			        }
		        })
	        } else {
		        yield put({
			        type: 'updateState',
			        payload: {
				        classifyList: [],
				        total: 0,
			        }
		        })
		        message.error(msg)
	        }
        },
	    //添加
	    *classifyAdd({payload}, {put, call, select}) {
		    const {info} = yield select(state => state.classify)
		    const {code, data, msg} = yield call(classifyAdd, info)
		    if(code === 200) {
			    yield put({type: 'updateState', payload: {modalVisible: false,}})
			    message.success(msg)
			    yield put(routerRedux.goBack())
		    } else{
		    	message.error(msg)
		    }
	    },
	    // 更新
	    *updateTagEdit({payload}, {put, call, select}) {
		    const {trickId, info} = yield select(state => state.classify)
		    const {code, data, msg} = yield call(updateTagEdit, {
			    ...info,
		        tag_id: trickId
		    })
		    if(code === 200) {
			    yield put({type: 'updateState', payload: {modalVisible: false,}})
			    message.success(msg)
			    yield put(routerRedux.goBack())
		    } else{
		    	message.error(msg)
		    }
	    },
	    // 获取详情
	    *classifyEdit({payload}, {put, call, select}) {
		    const {trickId} = yield select(state => state.classify)
		    const {code, data, msg} = yield call(classifyEdit, {
			    tag_id: trickId
		    })
		    if(code === '200') {
			    yield put({type: 'updateState', payload: {info: data,}})
		    } else{
			    message.error(msg)
		    }
	    },
	    // 删除
	    *delTags({payload}, {put, call, select}) {
		    const {trickId} = yield select(state => state.classify)
		    const {code, data, msg} = yield call(delTags, {
			    tag_id: trickId
		    })
		    if (code === '200') {
		    	message.success(msg)
			    yield put({type: 'getTagsListInfo', payload: {}})
			    yield put({type: 'updateState', payload: {modalVisibleList: false}})
		    } else {
			    message.error(msg)
		    }
	    }
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

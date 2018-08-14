import {message} from 'antd'
import {routerRedux} from 'dva/router'
import { getWorksDetail, getReplyList,getReminderReplay, getWorksList, receiveTrick, rejectWorkOrder, issuedUpdateOrder, finshTrick, startOncallJob, exportTrickList, batches} from 'services/works'

export default {
    namespace: 'works',

    state: {
	    trickId: 0,
		detailInfo: '',
	    replyList: [],
	    reminderReplyList: '',
	    worksList: [],
	    trickStatus: {},
	    per_page: 10,
	    current: 1,
	    total: 0,
	    caseType: '3',
	    search: {},
	    modalVisible: false,
	    modalVisibleList: false,
	    check_user_type: 1, // 指派工单配置
	    priorityList: [{
		    id: 1,
		    group_name: '一般(24小时)',
	    }, {
		    id: 2,
		    group_name: '重要(12小时)',
	    }, {
		    id: 3,
		    group_name: '紧急(2小时)',
	    }, {
		    id: 4,
		    group_name: '特急(1小时)',
	    }]
    },
    effects: {
    	* getWorksList({payload}, {put, call, select}) {
    		const {current, per_page,caseType, search} = yield select(state => state.works)
		    const {code, data, msg} = yield call(getWorksList, {
			    page: payload.current || current,
			    limit: per_page,
			    caseType,
			    ...search,
		    })
		    if(code === '200') {
			    yield put({
				    type: 'updateState',
				    payload: {
					    worksList: data.list,
					    total: data.total,
					    trickStatus: data.trickStatus,
				    }
			    })
		    } else {
			    yield put({
				    type: 'updateState',
				    payload: {
					    worksList: [],
					    total: 0,
					    trickStatus:  {1: 0, 2: 0, 3: 0, 4: 0, 6: 0}
				    }
			    })
			    message.error(msg)
		    }
	    },
        * getWorksDetail({payload}, {put, call}) {
            const {code, data, msg} = yield call(getWorksDetail, {
            	trickId: payload.trickId
            })
			if(code === '200') {
            	yield put({
		            type: 'updateState',
		            payload: {
		            	detailInfo: data
		            }
	            })
			} else {
            	message.error(msg)
			}
        },
	    * getReplyList({payload}, {put, call}) {
		    const {code, data, msg} = yield call(getReplyList, {
			    trickId: payload.trickId
		    })
		    if(code === '200') {
			    yield put({
				    type: 'updateState',
				    payload: {
					    replyList: data
				    }
			    })
		    } else {
			    message.error(msg)
		    }
	    },
	    * getReminderReplay({payload}, {put, call}) {
		    const {code, data, msg} = yield call(getReminderReplay, {
			    trickId: payload.trickId
		    })
		    if(code === '200') {
			    yield put({
				    type: 'updateState',
				    payload: {
					    reminderReplyList: data
				    }
			    })
		    } else {
			    message.error(msg)
		    }
	    },
	 //   领取工单
	    * receiveTrick({payload}, {put, call, select}) {
    	    const {trickId} = yield select(state => state.works)
		    const {code, data, msg} = yield call(receiveTrick, {
			    trickId
		    })
		    if(code == 200) {
    	    	message.success(msg);
			    yield put({
				    type: 'updateState',
				    payload: {
					    modalVisible: false,
					    modalVisibleList: false,
				    }
			    })
			    yield put({
				    type: 'getWorksDetail',
				    payload: {trickId}
			    });
			    yield put({
				    type: 'getWorksList',
				    payload: {}
			    });
			    yield put({
				    type: 'getReplyList',
				    payload: {trickId}
			    });
		    } else {
			    message.error(msg)
		    }
	    },
	    // 驳回工单
	    * rejectWorkOrder({payload}, {put, call, select}) {
		    const {trickId} = yield select(state => state.works)
		    const {code, data, msg} = yield call(rejectWorkOrder, {
			    trickId,
			    contents: payload.textarea,
			    attachs: payload.attachs
		    })
		    if(code == 200) {
			    message.success(msg);
			    yield put({
				    type: 'updateState',
				    payload: {
					    modalVisible: false,
					    modalVisibleList: false,
				    }
			    })
			    yield put({
				    type: 'getWorksDetail',
				    payload: {trickId}
			    });
			    yield put({
				    type: 'getWorksList',
				    payload: {}
			    });
			    yield put({
				    type: 'getReplyList',
				    payload: {trickId}
			    });
		    } else {
			    message.error(msg)
		    }
	    },
	    // 流转
	    * issuedUpdateOrder({payload}, {put, call, select}) {
		    const {trickId, detailInfo} = yield select(state => state.works)
		    const {code, data, msg} = yield call(issuedUpdateOrder, {
			    trickId,
			    issuedId: payload.issuedId,
			    status: 3,
			    contents: payload.textarea,
			    attachs: payload.attachs
		    })
		    if(code == 200) {
			    message.success(msg);
			    yield put({
				    type: 'updateState',
				    payload: {
					    modalVisible: false,
					    modalVisibleList: false,
				    }
			    })
			    yield put({
				    type: 'getWorksDetail',
				    payload: {trickId}
			    });
			    yield put({
				    type: 'getReplyList',
				    payload: {trickId}
			    });
		    } else {
			    message.error(msg)
		    }
	    },
	    // 处理完毕
	    * finshTrick({payload}, {put, call, select}) {
		    const {trickId, detailInfo} = yield select(state => state.works)
		    const {code, data, msg} = yield call(finshTrick, {
			    trickId,
			    isReplay: payload.isReplay,
			    status: detailInfo.status == 3?4: 2,
			    contents: payload.textarea,
			    attach: payload.attachs
		    })
		    if(code == 200) {
			    message.success(msg);
			    yield put({
				    type: 'updateState',
				    payload: {
					    modalVisible: false,
					    modalVisibleList: false,
				    }
			    })
			    yield put({
				    type: 'getWorksDetail',
				    payload: {trickId}
			    });
			    yield put({
				    type: 'getReplyList',
				    payload: {trickId}
			    });
		    } else {
			    message.error(msg)
		    }
	    },
	    // 指派
	    * startOncallJob({payload}, {put, call, select}) {
		    const {trickId, detailInfo} = yield select(state => state.works)
		    const {code, data, msg} = yield call(startOncallJob, {
			    trickId,
			    contents: payload.contents,
			    trackStatus: 3,
			    priority: payload.priority,
			    tag_id: payload.tag_id,
			    classify_id: payload.classify_id,
			    workers: payload.workers,
			    attachs: payload.attachs
		    })
		    if(code == 200) {
			    message.success(msg);
			    yield put({
				    type: 'updateState',
				    payload: {
					    modalVisible: false,
					    modalVisibleList: false,
				    }
			    })
			    yield put({
				    type: 'getWorksDetail',
				    payload: {trickId}
			    });
			    yield put({
				    type: 'getWorksList',
				    payload: {}
			    });
			    yield put({
				    type: 'getReplyList',
				    payload: {trickId}
			    });
		    } else {
			    message.error(msg)
		    }
	    },
	 //   批量导出
	    * exportTrickList({payload}, {put, call, select}) {
		    const {code, data, msg} = yield call(exportTrickList, {
			    ids: payload.ids
		    })
		    if(code == 200) {
			    message.success(msg);
			    window.location.href = data.filename;
		    } else {
			    message.error(msg)
		    }
	    },
	    //   批量处理
	    * batches({payload}, {put, call, select}) {
		    const {code, data, msg} = yield call(batches, {
			    fileUrl: payload.fileUrl
		    })
		    if(code == 200) {
			    message.success('批量处理成功');
			    yield put({
				    type: 'updateState',
				    payload: {
					    modalVisible: false,
					    modalVisibleList: false,
				    }
			    })
		    } else {
			    message.error(msg)
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

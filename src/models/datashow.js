/**
 * Created by guoguangyu on 2018/8/6.
 */
import { getPieDataInfo } from 'services/datashow'
import moment from 'moment'
import { message } from 'antd'

const getTimeRange = (val) => {
	const today = moment()
	if (val === '7') {
		return [moment(today).subtract(7, 'd'), today]
	}
	if (val === '14') {
		return [moment(today).subtract(14, 'd'), today]
	}
	return [today, today]
}
export default {
	namespace: 'datashow',
	state: {
		loading: true,
		ticketType: 0,
		timeRange: '7',
		type: 'trickType',
		time: getTimeRange('7'),
	},
	effects: {
		* getPieDataInfo ({ payload }, { call, put }) {
			yield put({
				type: 'setPieDataInfo',
				payload: {
					loading: true,
					data: {},
				},
			})
			const { code, data, msg } = yield call(getPieDataInfo, payload)
			yield put({
				type: 'setPieDataInfo',
				payload: {
					loading: false,
					data,
				},
			})
			if (code !== '200') {
				message.error(msg)
			}
		},
	},
	reducers: {
		changeState (state, { payload }) {
			const { key, value } = payload
			return {
				...state,
				[key]: value,
			}
		},
		setPieDataInfo (state, { payload }) {
			return {
				...state,
				dataInfo: payload.data,
				loading: payload.loading,
			}
		},
	},
}

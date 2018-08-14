/**
 * Created by guoguangyu on 2018/8/8.
 */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { DatePicker, Select, Button } from 'antd'
import moment from 'moment'
import styles from './index.less'

class PreviewHeader extends PureComponent {
	static propTypes = {
		datashow: PropTypes.object,
		dispatch: PropTypes.func,
		handleDownLoadImg: PropTypes.func,
	}
	onSelect = (value) => {
		const timeValue = this.getTimeRange(value)
		this.props.dispatch({
			type: 'datashow/changeState',
			payload: {
				key: 'timeRange',
				value,
			},
		})
		this.props.dispatch({
			type: 'datashow/changeState',
			payload: {
				key: 'time',
				value: timeValue,
			},
		})
	}
	getTimeRange = (val) => {
		const today = moment()
		if (val === '7') {
			return [moment(today).subtract(7, 'd'), today]
		}
		if (val === '14') {
			return [moment(today).subtract(14, 'd'), today]
		}
		return [today, today]
	}
	disabledDate = (current) => {
		const { datashow } = this.props
		const { timeRange, time } = datashow
		const value = time || this.getTimeRange(timeRange)
		const [start, end] = value
		return current < start || current > end
	}

	render () {
		const { datashow } = this.props
		const { timeRange, time } = datashow
		const value = time || this.getTimeRange(timeRange)
		return (
			<div className={styles['preview-header']}>
				<Select value={timeRange} style={{ width: 160 }} onSelect={this.onSelect}>
					<Select.Option value="0">今天</Select.Option>
					<Select.Option value="7">7天内</Select.Option>
					<Select.Option value="14">14天内</Select.Option>
				</Select>
				<DatePicker.RangePicker
					value={value}
					disabledDate={this.disabledDate}
				/>
				<Button onClick={this.props.handleDownLoadImg}>导出图表</Button>
			</div>
		)
	}
}
export default connect(({ datashow }) => ({ datashow }))(PreviewHeader)

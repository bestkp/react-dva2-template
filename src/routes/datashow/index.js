/**
 * Created by guoguangyu on 2018/8/6.
 */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Spin } from 'antd'
import Header from './Header'
import Preview from './Preview'

class DataShow extends PureComponent {
	static propTypes = {
		departList: PropTypes.array,
		datashow: PropTypes.object,
		dispatch: PropTypes.func,
	}
	componentDidMount () {
		this.fetchData(this.props.datashow)
	}
	componentDidUpdate (prevProps) {
		const {
			ticketType: prevTicketType,
			timeRange: prevTimeRange,
			type: prevType,
		} = prevProps.datashow
		const {
			ticketType, timeRange, type,
		} = this.props.datashow
		if (prevTicketType !== ticketType || prevTimeRange !== timeRange || prevType !== type) {
			this.fetchData(this.props.datashow)
		}
	}
	fetchData = (data) => {
		const timeInfo = data.time.map(v => v.format('YYYY:MM:DD HH:mm:ss')).join('~')
		this.props.dispatch({
			type: 'datashow/getPieDataInfo',
			payload: {
				timeInfo,
				'ticket_type': data.ticketType,
				type: data.type,
			},
		})
	}
	render () {
		const { departList, datashow: { loading } = {} } = this.props
		return (
			<div>
				<Header departList={departList} />
				<Spin spinning={loading}>
					<Preview loading={loading} />
				</Spin>
			</div>
		)
	}
}

export default connect(({ app, datashow }) => ({
	departList: app.departList,
	datashow,
}))(DataShow)

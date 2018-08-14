/**
 * Created by guoguangyu on 2018/8/6.
 */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Select, Menu } from 'antd'
import Box from './Box'

class Header extends PureComponent {
	static propTypes = {
		departList: PropTypes.array,
		datashow: PropTypes.object,
		dispatch: PropTypes.func,
	}
	onSelect = ({ key: value }) => {
		this.props.dispatch({
			type: 'datashow/changeState',
			payload: {
				key: 'type',
				value,
			},
		})
	}
	handleTicketTypeSelect = (value) => {
		this.props.dispatch({
			type: 'datashow/changeState',
			payload: {
				key: 'ticketType',
				value,
			},
		})
	}
	render () {
		const { departList = [], datashow } = this.props
		const { type, ticketType } = datashow
		const newDepartList = [{ id: 0, group_name: '全部部门' }].concat(departList)
		return (
			<Row type="flex" gutter={20}>
				<Col span={20}>
					<Box>
						<Menu
							selectedKeys={[type]}
							mode="horizontal"
							onSelect={this.onSelect}
						>
							<Menu.Item key="trickType">工单状态</Menu.Item>
							<Menu.Item key="trickClass">描述分类</Menu.Item>
							<Menu.Item key="handleTime">工单处理时长</Menu.Item>
							<Menu.Item key="workerAvgTime">工单处理人</Menu.Item>
						</Menu>
					</Box>
				</Col>
				<Col span={4}>
					<Box
						style={{
							padding: 0,
							justifyContent: 'center',
						}}
					>
						<Select
							value={ticketType}
							style={{
								width: '90%',
							}}
							onSelect={this.handleTicketTypeSelect}
						>
							{newDepartList.map(depart => (
								<Select.Option value={depart.id} key={depart.id}>
									{depart.group_name}
								</Select.Option>
							))}
						</Select>
					</Box>
				</Col>
			</Row>
		)
	}
}

export default connect(({ datashow }) => ({ datashow }))(Header)

/* eslint-disable no-tabs,indent,no-trailing-spaces */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {routerRedux} from 'dva/router'
import { Radio, Input, Select, message} from 'antd'
import {CButton, Tag, ShowMore, Modal, CountTextArea} from 'components'
import {queryUrl, renderForm} from 'utils'
import {weeks} from '../vars'
import styles from './index.less'

const Option = Select.Option;
const RadioGroup = Radio.Group;

class ClassifyDetail extends React.PureComponent {
	constructor (props) {
		super(props)
		this.state={
		
		}
	}
	componentWillMount() {
		const {location, dispatch} = this.props;
		const trickId = queryUrl(location.search).id;
		this.updateState({trickId})
		if(trickId !== '-1') {
			dispatch({
				type: 'classify/classifyEdit',
				payload: {}
			})
		}
	}
	
	
	submit = () => {
		this.updateState({
			modalVisible: true,
		})
	}
	onCancle = () => {
		this.updateState({
			modalVisible:false,
		})
	}
	onOk = () => {
		const {location, dispatch} = this.props;
		const trickId = queryUrl(location.search).id;
		this.updateState({trickId})
		if(trickId !== '-1') {
			dispatch({
				type: 'classify/updateTagEdit',
				payload: {values: this.state}
			})
		} else {
			dispatch({
				type: 'classify/classifyAdd',
				payload: {
					values: this.state
				}
			})
		}
	}
	onSelChange = (key, value) => {
		this.updateState({
			info: {...this.props.classify.info, [key]: value,}
		})
	}
	onInputChange = (e) => {
		this.updateState({
			info: {...this.props.classify.info, name: e.target.value,}
		})
	}
	onTextAreaChange = (value) => {
		this.updateState({
			info: {...this.props.classify.info, describe: value,}
		})
	}
	
	updateState = (payload) => {
		this.props.dispatch({
			type: 'classify/updateState',
			payload
		})
	}
	componentDidMount() {
		//设置登录人的部门显示权限
		this.updateState({
			info: {...this.props.classify.info, data_type: this.props.app.group_code,}
		})
	}
	render () {
		const {classify, app={}} = this.props;
		const {info} = classify
		const {isAdmin} = app
		const {modalVisible} = classify;
		const SelData = {
			'issuedId': app.userListInfo || [],//处理人
			'depart': app.departList, // 部门
			'type': app.classifyList, // 工单类型，
			'issue': app.tagListInfo // 工单问题
		}
		return (
			<div className={styles.classifyDetail}>
				<div className={styles.selRow}>
					<span className={styles.selItem}>
						<span className={styles.label}>部门</span>
						<Select
							className={styles.w210}
							placeholder="请选择"
							value={Number(info.data_type)}
							disabled={isAdmin === '0'}
							onChange={this.onSelChange.bind(this, 'data_type')}
							showSearch
							optionFilterProp="children"
							filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
						>
							<Option value={0}>全部</Option>
							{app.departList.map(item =>
								<Option value={item.id} key={item.id}>{item.group_name}</Option>
							)}
						</Select>
					</span>
					<span className={styles.selItem}>
						<span className={styles.label}>工单标签</span>
						<Select
							className={styles.w240}
							placeholder="请选择"
							value={info.tag_class}
							onChange={this.onSelChange.bind(this, 'tag_class')}
							showSearch
							optionFilterProp="children"
							filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
						>
							<Option value={'0'}>全部</Option>
							{Object.keys(app.classifyList).map(item =>
								<Option value={item} key={item}>{app.classifyList[item]}</Option>
							)}
						</Select>
					</span>
					<span className={styles.selItem}>
						<span className={styles.label}>描述</span>
						<Input
							className={styles.w210}
							placeholder="请输入"
							maxLength={10}
							value={info.name}
							onChange={this.onInputChange}
						></Input>
					</span>
				</div>
				<div className={styles.weekbox}>
					<span className={styles.label}>对接处理人</span><br/>
					<div className={styles.weekRow}>
						{
							weeks.map(week => {
								return <div key={week.key} className={styles.weekItem}>
									<p>{week.value}</p>
									<Select
										className={styles.w120}
										value={Number(info[week['key']])}
										onChange={this.onSelChange.bind(this, week.key)}
										placeholder="请选择"
										showSearch
										optionFilterProp="children"
										filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
										<Option value={0}>全部</Option>
										{app.userListInfo.map(item =>
											<Option value={item.id} key={item.id}>{`${item.name}__${item.department}`}</Option>
										)}
									</Select>
								</div>
							})
						}
					</div>
				</div>
				
				
				<div className={styles.descRow}>
					<span className={styles.label} style={{verticalAlign: 'top', lineHeight: '44px'}}>问题描述</span>
					<CountTextArea
						width={600}
						height={200}
						max={30}
						value={info.describe}
						onTextAreaChange={this.onTextAreaChange}
					></CountTextArea>
				</div>
				<div className={styles.btnRow}>
					<CButton style={{marginRight: '20px'}} type='primary' size='large' onClick={this.submit}>提交</CButton>
					<CButton type='normal' size='large' onClick={() => this.props.dispatch(routerRedux.goBack())}>返回</CButton>
				</div>
				<Modal
					width={380}
					title="提交"
					okText="确定"
					cancleText="取消"
					onOk={this.onOk}
					onCancle={this.onCancle}
					visible={modalVisible}
				>
					确认提交？
				</Modal>
			</div>
		)
	}
}

ClassifyDetail.protoType = {
	loading: PropTypes.object,
}

export default connect(({ loading, classify, app}) => ({ loading, classify, app}))(ClassifyDetail)

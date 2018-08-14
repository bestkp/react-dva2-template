/* eslint-disable no-tabs,indent,no-trailing-spaces */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {Link} from 'dva/router'
import {Upload, Button, message, Select} from 'antd'
import {CButton, SearchBar, DataTable, Modal, CountTextArea} from 'components'
import {searchs} from 'common'
import {tabs, columns} from './vars'
import {renderForm} from 'utils'
import tableColumns from 'utils/tableColumns';
import styles from './index.less'

const Option = Select.Option;

const {worksSearch, modalMulHandle, modalAssign, modalBackForm} = searchs

class Works extends React.PureComponent {
	constructor (props) {
		super(props)
		this.state={
			textarea: '',
			title: '',
			width: 516,
			okText: '',
			content: '',
			invalid: false,
			depart: '',
			issuedId: undefined,
			type: undefined,
			issue: undefined,
			level: undefined,
			fileList: [],
		}
	}
	componentWillMount() {
		this.getList();
	}
	componentWillUnmount() {
		this.updateState({
			modalVisibleList: false,
		})
	}
	updateState = (payload) => {
		this.props.dispatch({
			type: 'works/updateState',
			payload: payload
		})
		
	}
	onFileChange = (info) => {
		if(!['application/msword', 'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(info.file.type) && !info.file.type.startsWith('image/')) {
			message.error('文件格式有误');
			return;
		}
		if(info.file.size / 1024 / 1024 > 20) {
			message.error('文件不能超过20M');
			return;
		}
		let fl = info.fileList;
		fl = fl.map((file) => {
			if (file.response) {
				file.url = file.response.url;
			}
			return file;
		});
		fl = fl.filter((file) => {
			if (file.response) {
				return file.response.code === '200';
			}
			return true;
		});
		
		this.setState({ fileList: fl });
	}
	getList = (page) => {
		this.props.dispatch({
			type: 'works/getWorksList',
			payload: {
				current: page
			}
		})
	}
	onSearch = (values) => {
		this.updateState({
			search: values == null? {}: values
		})
		this.getList(1);
	}
	onTextAreaChange = (value) => {
		this.setState({textarea: value})
	}
	
	onSelChange = (key, value) => {
		let keyval = {
			[key]: value,
		}
		if(key === 'issuedId') {
			keyval.depart = value.split('__')[1]
		}
		this.setState(keyval)
	}
	onTabChange = (key) => {
		this.updateState({
			caseType: key,
			current: 1,
		})
		this.getList();
	}
	onPagination = (page) => {
		this.updateState({
			current: page
		})
		this.getList();
	}
	onCancle = () => {
		this.updateState({modalVisibleList: false})
	}
	onOk = () => {
		const {title, fileList, issuedId, type, issue, level, ids, textarea} = this.state;
		const {dispatch} = this.props
		if(title === '领取') {
			dispatch({
				type: 'works/receiveTrick',
				payload: {}
			})
		} else if(title === '批量处理') {
			if(fileList.length == 0) {
				message.error('请上传文件')
			} else {
				dispatch({
					type: 'works/batches',
					payload: {
						fileUrl: fileList.map(fal => fal.response.data).toString()
					}
				})
			}
		} else if(title === '批量指派' || title === '指派') {
			if(!issuedId && (!issue || !type)) {
				message.error("请选择处理人或者工单标签、描述")
				return;
			} else if(!level) {
				this.setState({
					invalid: true,
				})
				return
			} else {
				dispatch({
					type: 'works/startOncallJob',
					payload: {
						contents: textarea,
						priority: level,
						tag_id: issue,
						classify_id: type,
						trackStatus: 3,
						workers: issuedId ? issuedId.split('__')[0]: '',
						attachs: fileList.map(fal => fal.response.data).toString()
					}
				})
			}
		} else if(title === '驳回') {
			if(!textarea) {
				this.setState({
					invalid: true,
				})
				return;
			}
			dispatch({
				type: 'works/rejectWorkOrder',
				payload: {
					textarea: textarea,
					attachs: fileList.map(fal => fal.response.data).toString()
				}
			})
		}
		
	}
	showModal = () => {
		this.setState({
			visible: true
		})
	}
	//领取工单
	pickup = (id) => {
		this.setState({
			title: '领取',
			width: 380,
			okText: '领取',
			content: '确定领取工单？'
		})
		this.updateState({modalVisibleList: true, trickId: id})
	}
	onExport = (ids) => {
		this.props.dispatch({
			type: 'works/exportTrickList',
			payload: {
				ids
			}
		})
	}
	onHandle = (ids) => {
		this.setState({
			title: '批量处理',
			width: 516,
			okText: '处理',
			content: modalMulHandle,
			fileList: []
		})
		this.updateState({modalVisibleList: true})
	}
	assign = (id) => {
		modalAssign.forEach(ma => {
			if(ma.key === 'issuedId') {
				ma.required =  false
			} else if(ma.key === 'type' || ma.key === 'issue') {
				ma.required =  false
			}
		});
		this.setState({
			title: '指派',
			width: 711,
			okText: '指派',
			content: modalAssign,
			fileList: [],
			invalid: false,
			depart: '',
			issuedId: undefined,
			type: undefined,
			issue: undefined,
			level: undefined,
			textarea: ''
		})
		this.updateState({modalVisibleList: true, trickId: id})
	}
	getback = (id) => {
		this.setState({
			title: '驳回',
			width: 516,
			okText: '驳回',
			content: modalBackForm,
			fileList: [],
			textarea: ''
		})
		this.updateState({modalVisibleList: true, trickId: id})
	}
	
	render () {
		const {works, app = {}, loading} = this.props;
		const {group_code, isAdmin, isManger} = app
		const {width, title, okText, content, fileList, invalid, textarea} = this.state;
		const {worksList, current, total, caseType, priorityList, modalVisibleList, trickStatus} = works;
		worksList.forEach(da => {
			if(da.status === "待领取") {
				if(isManger === '0' && isAdmin === '0') {
					da.operation = <span className={styles.opration}><a  href="javascript:void(0)" onClick={this.pickup.bind(this, da.id)}>领取</a><Link to={`/works/detail?id=${da.id}`}>查看详情</Link></span>
				} else {
					da.operation = <span className={styles.opration}><a  href="javascript:void(0)" onClick={this.assign.bind(this, da.id)}>指派</a><a  href="javascript:void(0)" onClick={this.pickup.bind(this, da.id)}>领取</a><a  href="javascript:void(0)" onClick={this.getback.bind(this, da.id)}>驳回</a><Link to={`/works/detail?id=${da.id}`}>查看详情</Link></span>
				}
			} else {
				da.operation = <span className={styles.opration}><Link to={`/works/detail?id=${da.id}`}>查看详情</Link></span>
			}
			
		})
		const searchData = {
			ticket_type: {list: app.departList, value: isAdmin==='1' ? '0':Number(group_code), disabled: isAdmin === '0'},
			priority_id: {list: priorityList, value: '0', disabled: false,},
			classify_id: {list:app.classifyList, value: '0', disabled: false,},
			tag_id: {list: app.tagListInfo, value: '0', disabled: false,},
			work_user_id: {list: app.userList|| [], value: isManger==='1' || isAdmin==='1'? '0': String(app.userId), disabled: isManger === '0' && isAdmin==='0',},
		}
		const SelData = {
			'issuedId': app.userListInfo || [],//处理人
			'depart': app.departList, // 部门
			'level': priorityList, // 紧急程度
			'type': app.classifyList, // 工单标签，
			'issue': app.tagListInfo // 描述
		}
		const tabs = [
			{
				key: 6,
				name: `全部(${trickStatus[6] || 0})`,
			},{
				key: 1,
				name: `待领取(${trickStatus[1]  || 0})`,
			},{
				key: 3,
				name: `处理中(${trickStatus[3]  || 0})`,
			},{
				key: 4,
				name: `已处理(${trickStatus[4]  || 0})`,
			},{
				key: 2,
				name: `已关闭(${trickStatus[2]  || 0})`,
			}
		]
		return (
			<div>
				<div className="search">
					<SearchBar
						list={searchData}
						onSearch={this.onSearch}
						searchSource={worksSearch}
					></SearchBar>
				</div>
				<div className="data">
					<DataTable
						tabs={tabs}
						onTabChange={this.onTabChange}
						defaultKey={caseType}
						dataSource={worksList}
						columns={tableColumns.generateTableColumns(columns)}
						selectable={true}
						current={current}
						total={total}
						loading={loading.effects['works/getWorksList']}
						onPagination={this.onPagination}
						onExport={this.onExport}
						onHandle={this.onHandle}
						onAssign={this.assign}
					>
					</DataTable>
				</div>
				<Modal
					width={width}
					title={title}
					okText={okText}
					cancleText="取消"
					onOk={this.onOk}
					onCancle={this.onCancle}
					visible={modalVisibleList}
				>
					{
						typeof content === 'string' ?
							content:
							content.map((item, index) => {
								const stl = item.float? {float: item.float}: {};
								const stl1 = index <= 3 ? {width: '50%'}: {width: '100%'}
								if(item.type == "Textarea") {
									return <div className={styles.modalItem} style={stl} key={item.key}>
										<span style={{lineHeight: item.lineheight}} className={`${styles.modalLabel} ${item.required? styles.isrequire:''}`}>{item.name}</span>
										<CountTextArea style={invalid && !textarea?{border: '1px solid #FF3B30'}:{}} width={item.width} height={item.height} value={textarea} onTextAreaChange={this.onTextAreaChange}></CountTextArea>
										{item.desc && <p style={{color: '#999', fontSize: '12px', marginLeft: '77px'}}>{item.desc}</p>}
									</div>
								} else if(item.type === "Upload") {
									return <div className={styles.modalItem} style={stl} key={item.key}>
										<span style={{lineHeight: item.lineheight}} className={`${styles.modalLabel} ${item.required? styles.isrequire:''}`}>{item.name}</span>
										<Upload
											
											action= {`${API}/api/upload`}
											listType='picture'
											fileList={fileList}
											className="upload-list-inline"
											onChange={this.onFileChange}
											name="giftimg"
										>
											<Button disabled={fileList.length >= 4}>选择附件</Button>
										</Upload>
										{item.desc && <p style={{color: '#999', fontSize: '12px', marginLeft: '77px'}}>{item.desc}</p>}
									</div>
								} else if(item.type === 'Radio') {
									return <div className={styles.modalItem} style={stl} key={item.key}>
										<span style={{lineHeight: item.lineheight}} className={`${styles.modalLabel} ${item.required? styles.isrequire:''}`}>{item.name}</span>
										<RadioGroup onChange={this.onRadioChange} value={this.state.radio}>
											<Radio value={1}>需要回复</Radio>
											<Radio value={0}>不需要回复</Radio>
										</RadioGroup>
										{item.desc && <p style={{color: '#999', fontSize: '12px', marginLeft: '77px'}}>{item.desc}</p>}
									</div>
								} else if(item.type === "Input") {
									return <div className={styles.modalItem} style={stl} key={item.key}>
										<span style={{lineHeight: item.lineheight}} className={`${styles.modalLabel} ${item.required? styles.isrequire:''}`}>{item.name}</span>
										<Input />
										{item.desc && <p style={{color: '#999', fontSize: '12px', marginLeft: '77px'}}>{item.desc}</p>}
									</div>
								} else {
									return <div className={styles.modalItem} style={{...stl, ...stl1, display: 'inline-block'}} key={item.key}>
										<span style={{lineHeight: item.lineheight}} className={`${styles.modalLabel} ${item.required? styles.isrequire:''}`}>{item.name}</span>
										<Select
											showSearch
											disabled={item.disabled}
											value={this.state[item.key]}
											style={invalid && !this.state[item.key]&&item.required?{border: '1px solid #FF3B30', borderRadius: '4px'}: {}}
											optionFilterProp="children"
											placeholder="请选择"
											onChange={this.onSelChange.bind(this, item.key)}
											filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
										>
											{
												item.key === 'issuedId' && SelData['issuedId'].map(sd => {
													return <Option value={`${sd.id}__${sd.department}`} key={sd.id}>{sd.name}</Option>
												})
											}
											{
												item.key === 'depart' &&  SelData['depart'].map(sd => {
													return <Option value={`${sd.id}`} key={sd.id}>{sd.name}</Option>
												})
											}
											{
												item.key === "type" &&  Object.keys(SelData['type']).map(sd => {
													return <Option value={`${sd}`} key={sd}>{SelData['type'][sd]}</Option>
												})
											}
											{
												item.key === 'issue' && Object.keys(SelData['issue']).map(sd => {
													return <Option value={`${sd}`} key={sd}>{SelData['issue'][sd]}</Option>
												})
											}
											{
												item.key === 'level' && SelData['level'].map(sd => {
													return <Option value={`${sd.id}`} key={sd.id}>{sd.group_name}</Option>
												})
											}
										</Select>
										{item.desc && <p style={{color: '#999', fontSize: '12px', marginLeft: '77px'}}>{item.desc}</p>}
									</div>
								}
							})
					}
				</Modal>
			</div>
   
		)
	}
}

Works.protoType = {
	loading: PropTypes.object,
}

export default connect(({ loading, works, app }) => ({ loading, works, app }))(Works)

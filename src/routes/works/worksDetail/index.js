/* eslint-disable no-tabs,indent,no-trailing-spaces */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {Icon, Upload, Button, Radio, Input, Select, message} from 'antd'
import {CButton, Tag, ShowMore, Modal, CountTextArea, ImageViewer} from 'components'
import {queryUrl, renderForm} from 'utils'
import {WORK_STATUS, TAG_TYPE, searchs} from 'common'
import RenderForm from '../RenderForm'
import styles from './index.less'
import avator from '../../../public/avator.svg'

const Option = Select.Option;
const RadioGroup = Radio.Group;

const {worksSearch, modalBackForm, modalHandleOver, modalFlow} = searchs
let modalAssign = searchs.modalAssign;
// 客服回复
const kefuReply = (reply, index, that) => {
	const attaches = reply.attachMent;
	let imgs = [];
	let files = [];
	attaches && attaches.forEach(ats => {
		if(ats.attach.endsWith('.doc') || ats.attach.endsWith('.docx') ||ats.attach.endsWith('.xlsx')||ats.attach.endsWith('.xls') || ats.attach.endsWith('.csv')) {
			files.push(ats)
		} else {
			imgs.push(ats)
		}
	})
	return <div className={styles.kefuItem} key={reply.ticket_id + index}>
		<div className={styles.listheader}>
			<div className={styles.avator}>
				<img src={avator} alt=""/>
			</div>
			<div className={styles.info}>
				<p><span className={styles.userName}>{reply.send_worker}</span> <span className={styles.handleTime}>{reply.handleTime}</span></p>
				<p className={styles.time}>{reply.create_at}</p>
			</div>
		</div>
		<div className={styles.listDetail}>
			<ShowMore>{reply.content}</ShowMore>
		</div>
		{
			<div className={styles.attachs}>
				{
					imgs.map(tm => {
						let styls = {
							backgroundImage: "url("+tm.attach+")"
						}
						return <div onClick={that.openPreview.bind(that, tm.attach)} key={tm.attach} style={styls} className={styles.imgBox}></div>
					})
				}
				{
					files.length >0 && <div className={styles.attachFiles}>
						<p style={{marginBottom: '8px'}}>下载附件：</p>
						{files.map((fls, index) => <a className={styles.attachFilesItem} href={fls.attach} key={fls.attach}>附件{index+1}</a>)}
					</div>
				}
			</div>
		}
		
	</div>
}
// 催单
const cdReply = (reply, index) => {
	return <div className={styles.cdItem} key={reply.ticket_id+index}>
		<p><span className={styles.userName}>{reply.send_worker}</span> <span className={styles.time}>{reply.create_at}</span></p>
		<div style={{wordBreak: 'break-all'}} className={styles.cdDetail}>
			{reply.content}
		</div>
	</div>
}


class WorksDetail extends React.PureComponent {
	constructor (props) {
		super(props)
		this.state={
			title: '',
			width: 516,
			okText: '',
			content: '',
			fileList: [],
			textarea: '',
			invalid: false,//验证
			depart: undefined,
			issuedId: undefined,
			type: undefined,
			issue: undefined,
			level: undefined,
			radio: 1,
			previewVisible: false, //预览是否可见
			src: '' // 预览地址
		}
	}
	componentWillMount() {
		const {location, dispatch} = this.props;
		const trickId = queryUrl(location.search).id;
		this.updateState({trickId})
		this.getWorksDetail(trickId, dispatch)
		this.getReplyList(trickId, dispatch)
		this.getReminderReplyList(trickId, dispatch)
	}
	// 打开预览
	openPreview = (src) => {
		this.setState({
			previewVisible: true,
			src
		})
	}
	onViewCancel = () => {
		this.setState({
			previewVisible: false,
		})
	}
	// 工单详情
	getWorksDetail = (id, dispatch) => {
		dispatch({
			type: 'works/getWorksDetail',
			payload: {
				trickId: id
			}
		})
	}
	//客服回复列表
	getReplyList = (id, dispatch) => {
		dispatch({
			type: 'works/getReplyList',
			payload: {
				trickId: id
			}
		})
	}
	//催单列表
	getReminderReplyList = (id, dispatch) => {
		dispatch({
			type: 'works/getReminderReplay',
			payload: {
				trickId: id
			}
		})
	}
	// 操作
	onBtnClick = (status) => {
		//重置
		this.setState({
			fileList: [],
			textarea: '',
			invalid: false,//验证
			depart: undefined,
			issuedId: undefined,
			type: undefined,
			issue: undefined,
			level: undefined,
			radio: 1,
		})
		const {dispatch} = this.props;
		if(status === '领取') {
			this.setState({
				width: 380,
				title: '领取',
				okText: '领取',
				content: '确定领取此工单'
			})
		} else if(status === '驳回') {
			this.setState({
				width: 516,
				title: '驳回',
				okText: '驳回',
				content: modalBackForm,
			})
		} else if(status === '流转') {
			this.setState({
				width: 674,
				title: '流转',
				okText: '流转',
				content: modalFlow,
			})
		} else if(status === '处理完毕') {
			this.setState({
				width: 516,
				title: '处理完毕',
				okText: '提交',
				content: modalHandleOver,
			})
		} else if(status === '指派') {
			const {check_user_type} = this.props.works.detailInfo;
			modalAssign.forEach(ma => {
				if(ma.key === 'issuedId') {
					ma.required = check_user_type === 1? true: false
				} else if(ma.key === 'type' || ma.key === 'issue') {
					ma.required = check_user_type === 1? false: true
				}
			});
			this.setState({
				width: 711,
				title: '指派',
				okText: '指派',
				content: modalAssign,
			})
		}
		
		this.updateState({
			modalVisible:true,
		})
	}
	onCancle = () => {
		this.updateState({
			modalVisible:false,
		})
	}
	onOk = () => {
		const {dispatch} = this.props;
		const {textarea, fileList, issuedId, radio, type, issue, level} = this.state;
		
		
		switch (this.state.title) {
			case '领取':
				dispatch({
					type: 'works/receiveTrick',
					payload: {}
				})
				break;
			case '驳回':
				if(!textarea) {
					this.setState({
						invalid: true,
					})
					return;
				}
				dispatch({
					type: 'works/rejectWorkOrder',
					payload: {
						textarea,
						attachs: fileList.map(fal => fal.response.data).toString()
					}
				})
				break;
			case '流转':
				if(!textarea || !issuedId) {
					this.setState({
						invalid: true,
					})
					return;
				}
				dispatch({
					type: 'works/issuedUpdateOrder',
					payload: {
						issuedId: issuedId.split('__')[0],
						textarea,
						attachs: fileList.map(fal => fal.response.data).toString()
					}
				})
				break;
			case '处理完毕':
				if(!textarea) {
					this.setState({
						invalid: true,
					})
					return;
				}
				dispatch({
					type: 'works/finshTrick',
					payload: {
						isReplay: radio,
						textarea,
						attachs: fileList.map(fal => fal.response.data).toString()
					}
				})
				break;
			case '指派':
				const {check_user_type} = this.props.works.detailInfo;
				// 紧急程度必填  处理人和（工单类型，工单问题）选其一
				if((check_user_type === 1 && (!issuedId || !level)) || (check_user_type !== 1 && (!type || !issue || !level))) {
					this.setState({
						invalid: true,
					})
					return;
				}
				dispatch({
					type: 'works/startOncallJob',
					payload: {
						contents: textarea,
						priority: level,
						tag_id: issue,
						classify_id: type,
						workers: issuedId ? issuedId.split('__')[0]: '',
						attachs: fileList.map(fal => fal.response.data).toString()
					}
				})
				break;
		}
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
	onTextAreaChange = (value) => {
		this.setState({textarea: value})
	}
	onRadioChange = (e) => {
		this.setState({
			radio: e.target.value
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
	updateState = (payload) => {
		this.props.dispatch({
			type: 'works/updateState',
			payload
		})
	}
	render () {
		const {works, app} = this.props;
		const {detailInfo, replyList, reminderReplyList, modalVisible} = works;
		const {kefu_expedites=0, replayList=[]} = reminderReplyList;
		const {title, okText, content, width, textarea, invalid, fileList, src, previewVisible} = this.state;
		const SelData = {
			'issuedId': app.userListInfo || [],//处理人
			'depart': app.departList, // 部门
			'level': works.priorityList, // 紧急程度
			'type': app.classifyList, // 工单类型，
			'issue': app.tagListInfo // 工单问题
		}
		return (
			<div className={styles.worksDetail}>
				{detailInfo && <div className={styles.handlePanel}>
					<div className={styles.header}>
						<div className={styles.left}>
							<span className={styles.status}>{WORK_STATUS[detailInfo.status]}</span>
							<span className={styles.time}>{detailInfo.remain_time}</span>
						</div>
						<div className={styles.right}>
							<span className={styles.order}>订单号：{detailInfo.kefu_ticket_id}</span>|
							<span className={styles.depart}></span>{detailInfo.ticket_type}
						</div>
					</div>
					<div className={styles.content}>
						<div className={styles.item}>
							<h4>用户信息</h4>
							<div className={styles.detail}>
								<p>
									<span className={styles.label}>用户ID </span> <span className={styles.colon}>:</span>
									<span className={styles.value}>{detailInfo.customer_Id || '-'}</span>
								</p>
								<p>
									<span className={styles.label}>用户姓名 </span> <span className={styles.colon}>:</span>
									<span className={styles.value}>{detailInfo.customer_name || '-'}</span>
								</p>
								<p>
									<span className={styles.label}>注册号码 </span> <span className={styles.colon}>:</span>
									<span className={styles.value}>{detailInfo.customer_mobile || '-'}</span>
								</p>
								<p>
									<span className={styles.label}>用车城市 </span> <span className={styles.colon}>:</span>
									<span className={styles.value}>{detailInfo.bicycle_city || '-'}</span>
								</p>
							</div>
						</div>
						<div className={styles.item}>
							<h4><span style={{marginRight: '20px'}}>工单信息</span> {detailInfo.issue && <Tag type={TAG_TYPE[detailInfo.priority_id]}>{detailInfo.issue}</Tag>}</h4>
							<div className={styles.detail}>
								<p>
									<span className={styles.label1}>描述 </span> <span className={styles.colon}>:</span>
									<span className={styles.value}>{detailInfo.tag || '-'}</span>
								</p>
								<p>
									<span className={styles.label1}>发起人 </span> <span className={styles.colon}>:</span>
									<span className={styles.value}>{detailInfo.user_id || '-'}</span>
								</p>
								<p>
									<span className={styles.label1}>当前处理人 </span> <span className={styles.colon}>:</span>
									<span className={styles.value}>{detailInfo.work_user_id || '-'}</span>
								</p>
								<p>
									<span className={styles.label1}>上一步处理人 </span> <span
									className={styles.colon}>:</span>
									<span className={styles.value}>{detailInfo.last_person || '-'}</span>
								</p>
							</div>
						</div>
					</div>
					<div className={styles.footer}>
						{
							detailInfo.status === 1?
								<div>
									<CButton onClick={this.onBtnClick.bind(this, '指派')} style={{marginRight: '20px'}} type='primary' size='large'>指派</CButton>
									<CButton onClick={this.onBtnClick.bind(this, '领取')} style={{marginRight: '20px'}} type='primary' size='large'>领取</CButton>
									<CButton onClick={this.onBtnClick.bind(this, '驳回')} type='normal' size='large'>驳回</CButton>
								</div>: (
									detailInfo.status === 3 ?
										<div>
											<CButton onClick={this.onBtnClick.bind(this, '处理完毕')} style={{marginRight: '20px'}} type='primary' size='large'>处理完毕</CButton>
											<CButton onClick={this.onBtnClick.bind(this, '驳回')} type='normal' size='large'>驳回</CButton>
										</div>: (detailInfo.status === 4 ?
											<div>
												<CButton onClick={this.onBtnClick.bind(this, '处理完毕')} style={{marginRight: '20px'}} type='primary' size='large'>处理完毕</CButton>
												<CButton onClick={this.onBtnClick.bind(this, '驳回')} type='normal' size='large'>驳回</CButton>
											</div>: ''
										)
										
							)
						}
						
					</div>
					{
						detailInfo.status === 3  && <div onClick={this.onBtnClick.bind(this, '流转')} className={styles.cornerBtn}>
						<i className={styles.flowIcon}></i>
						<p style={{lineHeight: '1'}}>流转</p>
					</div>
					}
				</div>
				}
				<div className={styles.reply}>
					<div className={styles.left}>
						<h3>处理进度</h3>
						<div className={styles.ryList}>
							{
								replyList.length > 0 && replyList.map((rl,index) => {
								return kefuReply(rl, index, this);
							})
							}
							
						</div>
					</div>
					<div className={styles.right}>
						<h3>催单回复</h3>
						<div className={styles.ryList}>
							<div className={styles.cdCount}>
								<p className={styles.count}>{kefu_expedites}</p>
								<p>被催单数</p>
							</div>
							{
								replayList && replayList.length > 0 &&
								<div className={styles.cdList}>
									{
										replayList.map((rrl, index) => {
											return cdReply(rrl, index)
										})
									}
								</div>
							}
						</div>
					</div>
				</div>
				<Modal
					width={width}
					title={title}
					okText={okText}
					cancleText="取消"
					onOk={this.onOk}
					onCancle={this.onCancle}
					visible={modalVisible}
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
											<CountTextArea max={item.max || 100} style={invalid && !textarea?{border: '1px solid #FF3B30'}:{}} width={item.width} height={item.height} value={textarea} onTextAreaChange={this.onTextAreaChange}></CountTextArea>
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
				<ImageViewer
					onViewCancel={this.onViewCancel}
					src={src}
					previewVisible={previewVisible}
				></ImageViewer>
			</div>
		)
	}
}

WorksDetail.protoType = {
	loading: PropTypes.object,
}

export default connect(({ loading, works, app}) => ({ loading, works, app}))(WorksDetail)

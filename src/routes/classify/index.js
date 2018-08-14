/* eslint-disable no-tabs,indent,no-trailing-spaces */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {Link} from 'dva/router'
import moment from 'moment'
import {CButton, SearchBar, DataTable, Modal} from 'components'
import {searchs} from 'common'
import {columns} from './vars'
import DateShow from './DateShow'
import {renderForm} from 'utils'
import tableColumns from 'utils/tableColumns';
import styles from './index.less'

const {classifySearch, modalBackForm, modalHandleOver, modalFlow, modalAssign} = searchs;

class Classify extends React.PureComponent {
	constructor (props) {
		super(props)
	}
	componentDidMount() {
		this.getList();
	}
	updateState = (payload) => {
		this.props.dispatch({
			type: 'classify/updateState',
			payload: payload
		})
	}
	getList = (page) => {
		this.props.dispatch({
			type: 'classify/getTagsListInfo',
			payload: {
				current: page
			}
		})
	}
	onSearch = (values) => {
		//默认选择该人所在部门
		this.updateState({
			search: values == null? {}: values
		})
		this.getList(1);
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
		this.props.dispatch({
			type: 'classify/delTags',
			payload: {}
		})
	}
	showModal = () => {
		this.setState({
			visible: true
		})
	}
	del = (id) => {
		this.updateState({modalVisibleList: true, trickId: id})
	}
	render () {
		const {classify, app = {}, loading} = this.props;
		const {modalVisibleList, classifyList, total, current } = classify
		classifyList.forEach(da => {
			da.operation = <span className={styles.opration}><Link to={`/classify/edit?id=${da.id}`}>编辑</Link><a  href="javascript:void(0)" onClick={this.del.bind(this, da.id)}>删除</a></span>
		})
		const searchData = {
			ticket_type: {list: app.departList, value: app.isAdmin === '1'? '0':Number(app.group_code), disabled: app.isAdmin === '0'},
			classify_id: {list:app.classifyList, value: '0', disabled: false,},
			tag_id: {list: app.tagListInfo, value: '0', disabled: false,},
			work_user_id: {list: app.userList|| [], value: '0', disabled: false,},
		}
		return (
			<div className={styles.classify}>
				<div className={styles.search}>
					<DateShow></DateShow>
					<SearchBar
						cols={2}
						list={searchData}
						onSearch={this.onSearch}
						searchSource={classifySearch}
					>
						<Link to="/classify/edit?id=-1"><CButton className={styles.addBtn}>添加</CButton></Link>
					</SearchBar>
				</div>
				<div className="data">
					<DataTable
						tabs={[]}
						dataSource={classifyList}
						columns={tableColumns.generateTableColumns(columns)}
						selectable={false}
						current={current}
						total={total}
						loading={loading.effects['classify/getTagsListInfo']}
						onPagination={this.onPagination}
						onExport={this.onExport}
					>
					</DataTable>
				</div>
				<Modal
					width={380}
					title="删除"
					okText="确定"
					cancleText="取消"
					onOk={this.onOk}
					onCancle={this.onCancle}
					visible={modalVisibleList}
				>
					请确认是否删除本条描述？
				</Modal>
			</div>
   
		)
	}
}

Classify.protoType = {
	loading: PropTypes.object,
}

export default connect(({ loading, classify, app }) => ({ loading, classify, app }))(Classify)

/***
 * 列表组件
 * created by kp
 * tabs 不传或传[] 不显示tabs
 * onTabChange: tab切换事件
 * defaultKey： tab 默认选中
 * dataSource： 表格的数据
 * columns： 表格的列
 * selectable： 是否可选
 * current： 当前页数
 * total： 总数据数
 * onPagination： 分页切换事件
 */
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {Table, Tabs, Pagination} from 'antd'
import {CButton} from 'components'
import styles from './index.less'

const TabPane = Tabs.TabPane;

export default class DataTable extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			showMultiBar: false,
			ids: '',
		}
	}
	
	onChange = (selectedRowKeys, selectedRows) => {
		let showMultiBar =  selectedRows.length >= 2 ? true: false;
		this.setState({showMultiBar, ids: selectedRowKeys})
	}
	
	render() {
		const {
			tabs,
			onTabChange,
			defaultKey,
			dataSource,
			columns,
			selectable,
			current,
			total,
			loading,
			onPagination,
			onExport,
			onHandle,
			onAssign
		} = this.props
		const rowSelection = {
			columnWidth: 50,
			onChange: this.onChange
		};
		const {showMultiBar, ids} = this.state;
		return (
			<div className={styles.dataTable}>
				<div className={styles.bg}>
					{
						tabs && tabs.length > 0 &&
						<div className={styles.tabs}>
							<Tabs defaultActiveKey={defaultKey} onChange={onTabChange}>
								{tabs.map(tab => <TabPane tab={tab.name} key={tab.key}></TabPane>)}
							</Tabs>
						</div>
						
					}
					<Table
						dataSource={dataSource}
						columns={columns}
						loading={loading}
						rowKey={row => row.id}
						pagination={false}
						scroll={{x: 1100}}
						bordered={false}
						locale={{emptyText: '暂无数据'}}
						rowSelection={selectable ? rowSelection: null}
					>
					</Table>
				</div>
				
				<div className={styles.page}>
					{
						selectable && dataSource.length>0 &&  <div className={styles.multiOp}>
							<CButton className={styles.handle} onClick={() => {onHandle(ids)}} type="primary" size="large">批量处理</CButton>
							<CButton disabled={!showMultiBar} className={styles.export} onClick={() => {onExport(ids)}} type="normal" size="large">批量导出</CButton>
							<CButton disabled={!showMultiBar} type="normal" onClick={() => {onAssign(ids)}} size="large">批量指派</CButton>
						</div>
					}
					<Pagination
						current={current}
						total={total}
						showTotal={() => {
							return `共${total}条`
						}}
						hideOnSinglePage={true}
						onChange={(page) => {
							onPagination(page)
						}}
					></Pagination>
				</div>
			</div>
		)
		
	}
	
}
DataTable.propTypes = {
	tabs: PropTypes.array,
	onTabChange: PropTypes.func,
	dataSource: PropTypes.array,
	columns: PropTypes.array,
	selectable: PropTypes.bool,
	total: PropTypes.number,
	loading: PropTypes.bool,
	onPagination: PropTypes.func
}
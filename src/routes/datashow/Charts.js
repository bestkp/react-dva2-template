/**
 * Created by guoguangyu on 2018/8/8.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Select } from 'antd'
import G2 from '@antv/g2'
import DataSet from '@antv/data-set'
import zipObject from 'lodash/zipObject'
import zip from 'lodash/zip'
import throttle from 'lodash/throttle'
import styles from './index.less'
// import Slider from './Slider'

class Charts extends Component {
	static propTypes = {
		title: PropTypes.string,
		type: PropTypes.string,
		superType: PropTypes.string,
		data: PropTypes.any,
		clientWidth: PropTypes.number,
		downLoadImg: PropTypes.bool,
		handleDownLoadedImg: PropTypes.func,
	}
	constructor (props) {
		super(props)
		const { title, clientWidth } = props
		this.chart = null
		this.node = null
		this.ds = null
		this.index = Math.floor(clientWidth / 50)
		this.state = {
			selectValue: title === 'trickClass-line' ? '所有描述' : '所有描述平均处理时长',
		}
		this.titleHash = {
			'trickType-line': '工单状态走势图',
			'trickType-pie': '工单状态占比图',
			'trickClass-line': '工单分类统计图',
			'trickClass-bar': '工单描述分类分布图',
			'handleTime-line': '工单描述平均处理时常统计图',
			'handleTime-bar': '平均处理时常分布图',
		}
	}
	componentDidMount () {
		const { superType, type, data } = this.props
		const d = this.formatData(superType, type, data)
		this.renderChart(this.node, d)
	}
	getSnapshotBeforeUpdate (prevProps) {
		const { clientWidth, downLoadImg } = this.props
		const { clientWidth: preClientWidth, downLoadImg: preDownLoadImg } = prevProps
		if (downLoadImg && !preDownLoadImg) {
			this.handleDownLoadImg()
		}
		return clientWidth !== preClientWidth
	}
	componentDidUpdate (prevProps, prevState, snapshot) {
		if (snapshot) {
			const { superType, type, data, clientWidth } = this.props
			this.index = Math.floor(clientWidth / 60)
			const d = this.formatData(superType, type, data)
			this.chart.destroy()
			this.renderChart(this.node, d)
		}
	}
	onSelect = (value) => {
		this.setState({ selectValue: value }, () => {
			const { superType, type, data } = this.props
			const d = this.formatData(superType, type, data)
			this.chart.changeData(d.dv)
		})
	}
	handleDownLoadImg = () => {
		const { title } = this.props
		const now = moment().format('YYYY-MM-DD')
		const name = `${now}-${this.titleHash[title]}`
		this.chart.downloadImage(name)
		this.props.handleDownLoadedImg()
	}
	formatDescriptor = (data) => {
		const { dataInfo } = data
		if (dataInfo) {
			return Object.keys(dataInfo)
		}
		return ''
	}
	formatOnlyData = (data, type) => {
		const { dataInfo, legend, xAxis } = data
		if (type === 'bar') {
			if (!dataInfo && !legend && !xAxis) {
				const toNumber = Object.keys(data).reduce((acc, cur) => {
					acc[cur] = parseFloat(data[cur])
					return acc
				}, {})
				return [].concat(toNumber)
			}
			return legend.map(name => ({
				name,
				...(zipObject(xAxis, dataInfo[name])),
			}))
		}
		return []
	}
	formatData = (superType, type, data) => {
		const { dataInfo, legend, xAxis } = data
		const { selectValue } = this.state
		const fields = xAxis || Object.keys(data)
		// 'handleTime'
		const isShowSelect = type === 'line' && ['trickClass', 'handleTime'].includes(superType)
		this.ds = new DataSet({
			state: {
				from: 0,
				to: 0,
			},
		})
		if (isShowSelect) {
			const zipData = fields.map((date, i) => ({
				time: date,
				num: parseFloat(dataInfo[selectValue][i]),
			}))
			return { superType, type, dv: zipData }
		}
		if (type === 'pie') {
			return { type, dv: data.dataInfo }
		}
		if (type === 'line') {
			const zipInfo = zip(...dataInfo)
			const zipData = xAxis.map((name, i) => {
				return {
					name,
					...(zipObject(legend, zipInfo[i])),
				}
			})
			const dv = this.ds.createView().source(zipData)
			dv.transform({
				type: 'fold',
				fields: legend,
				key: 'type', // key字段
				value: 'num', // value字段
			})
			return { type, dv }
		}
		if (type === 'bar') {
			const zipData = this.formatOnlyData(data, type)
			const dv = this.ds.createView('bar')
			this.ds.setState('from', fields[0])
			this.ds.setState('to', fields[this.index])
			dv.source(zipData).transform({
				type: 'fold',
				fields,
				key: 'type', // key字段
				value: 'num', // value字段
			}).transform({
				type: 'filter',
				callback: (obj) => {
					//TODO 依据slide过滤源数据，可能有性能问题
					const from = this.ds.state.from
					const to = this.ds.state.to
					const fromIndex = fields.findIndex(item => item === from)
					const toIndex = fields.findIndex(item => item === to)
					const newRound = fields.slice(fromIndex, toIndex)
					return !!~newRound.indexOf(obj.type)
				},
			})
			// 强制更新，传递最新的data 和 ds 到slider组件
			this.forceUpdate()
			return { superType, type, dv }
		}
		if (type === 'lineBar') {
			const dv = data.map(n => ({
				...n,
				avgTime: parseFloat(n.avgTime),
				handleSum: parseFloat(n.handleSum),
			}))
			return { type, dv }
		}
		return { type, dv: data }
	}
	renderChart = (container, data) => {
		const { clientWidth } = this.props
		this.index = Math.floor(clientWidth / 60)
		const { superType, type, dv } = data
		const { title } = this.props
		this.chart = new G2.Chart({
			container,
			forceFit: true,
			height: 418,
			padding: 'auto',
		})
		if (superType && type === 'line') {
			this.chart.source(dv)
			this.chart.line().position('time*num')
			this.chart.point().position('time*num').size(4).shape('circle')
				.style({
					stroke: '#fff',
					lineWidth: 1,
				})
		} else if (type === 'bar') {
			this.chart.source(dv)
			this.chart.axis('type', {
				label: {
					textStyle: {
						rotate: 30,
					},
				},
			})
			let startX = 0
			let moved = false
			let index = 0
			// 绑定事件
			this.chart.on('mousedown', (e) => {
				startX = e.x
				moved = true
			})
			this.chart.on('mousemove', throttle((ev) => {
				if (startX && moved) {
					const { transforms } = dv
					const { fields } = transforms.find(n => n.type === 'fold')
					const moveX = ev.x - startX
					const fLen = fields.length
					if (moveX < 0) {
						if (index) {
							index--
						}
						// left
					} else if (moveX > 0) {
						if (index + this.index <= fLen) {
							index++
						}
						// right
					}
					if (index === 0) {
						startX = ev.x
					}
					if (index + this.index <= fLen) {
						this.ds.setState('from', fields[index])
						this.ds.setState('to', fields[index + this.index])
					}
				}
			}, 200))
			this.chart.on('mouseup', () => {
				startX = 0
				moved = false
			})
			this.chart.on('plotleave', () => {
				startX = 0
				moved = false
			})
			// 平均处理时常分布图 Y轴重命名
			if (title === 'handleTime-bar') {
				this.chart.scale('num', {
					alias: '平均处理时长',
				})
				this.chart.intervalStack().position('type*num').color('type')
			} else {
				this.chart.intervalStack().position('type*num').color('name')
			}
		} else if (type === 'line') {
			this.chart.source(dv)
			this.chart.line().position('name*num').color('type').shape('smooth')
			this.chart.point()
				.position('name*num')
				.color('type')
				.size(4)
				.shape('circle')
				.style({
					stroke: '#fff',
					lineWidth: 1,
				})
		} else if (type === 'pie') {
			this.chart.coord('theta', {
				radius: 0.75,
			})
			this.chart.source(dv)
			this.chart.legend(true, {
				position: 'right-center',
			})
			this.chart.tooltip({
				showTitle: false,
				itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
			})
			this.chart.intervalStack().position('sum')
				.color('status')
				.label('sum', {
					formatter: function formatter (val, item) {
						return `${item.point.status}:${val}`
					},
				})
				.style({
					lineWidth: 1,
					stroke: '#fff',
				})
		} else if (type === 'lineBar') {
			this.chart.source(dv)
			this.chart.axis('depart', {
				label: {
					textStyle: {
						rotate: 30,
					},
				},
			})
			this.chart.scale('handleSum', {
				alias: '处理工单量',
			})
			this.chart.scale('avgTime', {
				alias: '平均处理时长',
			})
			this.chart.interval().position('depart*handleSum')
			this.chart.line().position('depart*avgTime')
			this.chart.point().position('depart*avgTime').size(4).shape('circle')
				.style({
					stroke: '#fff',
					lineWidth: 1,
				})
		}
		this.chart.render()
	}
	render () {
		const { superType, type, data, title } = this.props
		const { selectValue } = this.state
		const descriptor = this.formatDescriptor(data)
		const isShowSelect = type === 'line' && ['trickClass', 'handleTime'].includes(superType)
		return (
			<div style={{ width: '100%' }} className={styles['charts-select']}>
				{isShowSelect ? (
					<Select
						value={selectValue}
						style={{
							width: 160,
							background: 'rgba(245,248,250,1)',
						}}
						onSelect={this.onSelect}
					>
						{descriptor.map(desc => (
							<Select.Option value={desc} key={desc}>
								{desc}
							</Select.Option>
						))}
					</Select>
				) : null}
				<div
					ref={(node) => { this.node = node }}
					className={styles['charts-box']}
				/>
				{/*{ type === 'bar' ? <Slider ds={this.ds} /> : null}*/}
				<h1
					style={{
						fontSize: 16,
						textAlign: 'center',
						color: '#333',
					}}
				>{this.titleHash[title]}
				</h1>
			</div>
		)
	}
}
export default Charts

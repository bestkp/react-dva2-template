/**
 * Created by guoguangyu on 2018/8/13.
 */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import G2Slider from '@antv/g2-plugin-slider'

export default class Slider extends PureComponent {
	static propTypes = {
		ds: PropTypes.object,
	}
	constructor (props) {
		super(props)
		this.node = null
		this.slider = null
	}
	componentDidUpdate () {
		const { ds } = this.props
		this.renderSlider(this.node, ds)
	}
	// componentWillUnmount () {
	// 	this.slider.destroy()
	// }
	renderSlider = (container, ds) => {
		const dv = ds.getView('bar')
		const { origin, transforms } = dv
		const fold = transforms.find(n => n.type === 'fold')
		const data = ds.createView().source(origin).transform(fold)
		this.slider = new G2Slider({
			container,
			padding: [20, 100, 60],
			start: ds.state.from,
			end: ds.state.to,
			data,
			xAxis: 'type',
			yAxis: 'num',
			backgroundChart: {
				type: 'interval',
				color: 'rgba(0, 0, 0, 0.3)',
			},
			onChange: (obj) => {
				// !!! 更新状态量
				const { startText, endText } = obj
				ds.setState('from', startText)
				ds.setState('to', endText)
			},
		})
		this.slider.render()
	}
	render () {
		return (
			<div ref={(ref) => { this.node = ref }} />
		)
	}
}

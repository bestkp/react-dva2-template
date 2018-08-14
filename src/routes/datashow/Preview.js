/**
 * Created by guoguangyu on 2018/8/8.
 */
/* global window: true */
import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Box from './Box'
import PreviewHeader from './PreviewHeader'
import Charts from './Charts'

class Preview extends PureComponent {
	static propTypes = {
		charts: PropTypes.any,
		superType: PropTypes.string,
		loading: PropTypes.bool,
	}
	state = {
		clientWidth: 0,
		downLoadImg: false,
	}
	componentDidMount () {
		const clientWidth = ReactDOM.findDOMNode(this).clientWidth
		this.setState({ clientWidth })
		window.addEventListener('resize', this.handleResize, false)
	}
	componentWillUnmount () {
		window.removeEventListener('resize', this.handleResize, false)
	}
	handleResize = () => {
		const clientWidth = ReactDOM.findDOMNode(this).clientWidth
		this.setState({ clientWidth })
	}
	handleDownLoadImg = () => {
		this.setState({ downLoadImg: true })
	}
	handleDownLoadedImg = () => {
		this.setState({ downLoadImg: false })
	}
	render () {
		const { charts = {}, superType, loading } = this.props
		const chartTypes = Array.isArray(charts) ? ['lineBar'] : Object.keys(charts)
		return (
			<Box style={{ marginTop: 32, padding: 40, minHeight: 200 }}>
				{!loading ? <PreviewHeader handleDownLoadImg={this.handleDownLoadImg} /> : null}
				{chartTypes.map(type => (
					<Charts
						clientWidth={this.state.clientWidth}
						downLoadImg={this.state.downLoadImg}
						handleDownLoadedImg={this.handleDownLoadedImg}
						title={`${superType}-${type}`}
						superType={superType}
						type={type}
						key={type}
						data={type === 'lineBar' ? charts : charts[type]}
					/>
				))}
			</Box>
		)
	}
}
export default connect(({ datashow }) => ({
	charts: datashow.dataInfo,
	superType: datashow.type,
}))(Preview)

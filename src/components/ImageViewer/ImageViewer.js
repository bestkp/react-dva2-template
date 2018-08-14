/***
 * 基于antd-Modal的图片预览组件(临时)
 *
 */
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {Modal} from 'antd'
import styles from './ImageViewer.less'

export default class ImageViewer extends PureComponent{
	constructor(props) {
		super(props);
	}
	render() {
		const {previewVisible, src, onViewCancel} = this.props;
		return (
			<Modal
				visible={previewVisible}
				footer={null}
				width={900}
				wrapClassName={`vertical-center-modal ${styles.preview}`}
				onCancel={onViewCancel}>
				<img alt="" onClick={onViewCancel} style={{ width: '100%' }} src={src} />
			</Modal>
		)
		
	}
	
}
ImageViewer.propTypes = {

}
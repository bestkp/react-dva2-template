/**
 * Created by guoguangyu on 2018/8/8.
 */
import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'

export default function Box (props) {
	const { classname = '', style = {} } = props
	return (
		<div className={`${classname} ${styles['dataShow-box']}`} style={style}>
			{ props.children }
		</div>
	)
}
Box.propTypes = {
	children: PropTypes.node.isRequired,
	classname: PropTypes.string,
	style: PropTypes.object,
}

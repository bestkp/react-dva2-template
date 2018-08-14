/***
 * 标签组件
 * type: primary important urgency urgencyer
 *       一般     重要      紧急      特急
 */
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import styles from './Tag.less'

export default class Tag extends PureComponent{
	constructor(props) {
		super(props);
	}
	render() {
		const {type = "primary", style, children} = this.props;
		return (
			<span style={style} className={`${styles[type]} ${styles.tag}`}>{children}</span>
		)
	}
	
}
Tag.propTypes = {
	type: PropTypes.string,
}
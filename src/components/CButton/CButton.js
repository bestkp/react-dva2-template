/***
 * 按钮组件
 * type: primary normal danger
 * size: large middle small
 * disabled
 */
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import styles from './CButton.less'

export default class cButton extends PureComponent{
	constructor(props) {
		super(props);
	}
	render() {
		const {type = "primary", className, size="large", onClick, children, disabled, style} = this.props;
		const btndisabled = disabled ? styles.disabled: '';
		return (
			<button style={style} onClick={onClick} className={`${className} ${styles[type]} ${styles[size]} ${styles.button} ${btndisabled}`} href="javascript: void(0)">{children}</button>
		)
	}
	
}
cButton.propTypes = {
	menuList: PropTypes.array,
	location: PropTypes.object,
	type: PropTypes.string,
	size: PropTypes.string,
}
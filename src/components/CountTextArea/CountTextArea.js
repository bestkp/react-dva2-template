/***
 * 基于antd 带有计数textarea组件
 *
 */
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {Input} from 'antd'
import styles from './CountTextArea.less'
const {TextArea} = Input
const defaultLen = 100;

export default class CountTextArea extends PureComponent{
	constructor(props) {
		super(props);
		this.state = {
			len: 0,
			value1: ''
		}
	}
	componentDidMount() {
		this.setState({
			value1: 0,
			len: 0
		})
	}
	change= (e) => {
		let val = e.target.value.trimLeft();
		this.setState({len: val.length, value1: val})
		this.props.onTextAreaChange(val)
	}
	render() {
		const {len, value1} = this.state;
		const {max=defaultLen, onTextAreaChange, width, style, height, value} = this.props;
		const sty={...style, ...{width, height}};
		return (
			<span className={styles.CountTextArea}>
				<TextArea style={sty} maxLength={max} placeholder={"请输入"} onChange={this.change} value={value}></TextArea>
				<span className={styles.count} style={len>=max?{color:'#FF6060'}: {}}>{value? value.length :this.state.len} / {max}</span>
			</span>
			
		)
	}
	
}
CountTextArea.propTypes = {
	type: PropTypes.string,
}
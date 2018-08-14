/***
 * 查看更多
 */
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import styles from './ShowMore.less'

export default class Tag extends PureComponent{
	constructor(props) {
		super(props);
		this.state = {
			isover: false
		};
	}
	showmore = () => {
		this.setState({
			isover: false
		})
	}
	componentDidMount() {
		var ele = this.refs.contentEl;
		this.setState({
			isover: ele.offsetHeight > 80
		})
	}
	render() {
		const { style, children} = this.props;
		const {isover} = this.state;
		const contenthtml = {__html: children.replace(/\r/ig, "").replace(/\n/ig, "<br/>")}
		return (
			<span style={style} className={styles.showMore}>
				<p ref="contentEl" style={isover?{height: '72px',overflow: 'hidden'}: {height: 'auto', overflow: 'auto'}} className={styles.content} dangerouslySetInnerHTML={contenthtml}></p>
				{isover && <span className={styles.morebtn} onClick={this.showmore}>展开更多</span>}
			</span>
		)
	}
	
}
Tag.propTypes = {
	type: PropTypes.string,
}
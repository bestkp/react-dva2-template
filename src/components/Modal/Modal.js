/***
 * 弹窗组件
 * width: 宽度
 * visible: modal是否可见
 * title: 标题
 * okText: 确定按钮文本
 * cancleText： 取消按钮文本
 * onOk: 确定事件
 * onCancle: 取消事件
 */
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import CButton from '../CButton';
import styles from './Modal.less'
const animation = 'slideUp';

const Dialog = props => {
	const className = `${styles.modalDialog} ${styles['modal'+animation+props.animationType]}`;
	const CloseButton = <span className={styles.modalClose} onClick={props.onCancle} />
	const { width, title, onCancle, children, cancleText="取消", okText="确定", onOk,} = props;
	const sty = {
		width: width + 'px',
	};
	return (
		<div style={sty} className={className}>
			<div className={styles.modalHeader}>
				{title}
				<span onClick={() => {onCancle()}} className={styles.modalClose}></span>
			</div>
			<div className={styles.modalBody}>
				{children}
			</div>
			<div className={`${styles.footer}`}>
				<CButton style={{marginRight: '20px'}} size="middle" onClick={() => {
					onCancle && onCancle()
				}} type="normal">{cancleText}</CButton>
				<CButton size="middle" onClick={() => {
					onOk && onOk()
				}} type="primary">{okText}</CButton>
			</div>
		</div>
	)
};


export default class Modal extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isShow: false,
			animationType: 'leave'
		}
	}
	escFunction = (event) =>{
		if(event.keyCode === 27) {
			this.props.onCancle();
		}
	}
	
	componentWillReceiveProps(nextProps) {
		if (!this.props.visible && nextProps.visible) {
			this.enter();
		} else if (this.props.visible && !nextProps.visible) {
			this.leave();
		}
	}
	componentDidMount(){
		if (this.props.visible) {
			this.enter();
		}
	}
	componentWillUnmount(){
		document.removeEventListener("keydown", this.escFunction, false);
	}
	enter = () => {
		this.setState({
			isShow: true,
			animationType: 'enter'
		});
	}
	onKeyUp = event => {
		if (event.keyCode === 27) {
			this.props.onCancle();
		}
	}
	
	leave =() => {
		this.setState({ animationType: 'leave' });
	}
	animationEnd =() => {
		if (this.state.animationType === 'leave') {
			this.setState({ isShow: false });
		} else if (this.props.closeOnEsc) {
			this.el.focus();
		}
		
		if (event.target === this.el) {
			const { onAnimationEnd } = this.props;
			onAnimationEnd && onAnimationEnd();
		}
	}
	render() {
		const {width="516", visible=false, closeOnEsc=true, className="", title, style, children, okText, cancleText, onOk, onCancle} = this.props;
		const {isShow, animationType} = this.state;
		const switchStyle = {
			display: isShow ? '' : 'none',
		};
		return (
			<div
				style={switchStyle}
				className={`${styles.modal} ${styles['modalfade'+animationType]} ${className}`}
				onAnimationEnd={this.animationEnd}
				tabIndex="-1"
				ref={el => { this.el = el; }}
				onKeyUp={this.onKeyUp}
			>
				<div className={styles.mask}/>
				<Dialog {...this.props} animationType={animationType}>
					{this.props.children}
				</Dialog>
			</div>
		)
	}
	
}
Modal.propTypes = {}
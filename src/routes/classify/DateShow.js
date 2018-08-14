import React, {PureComponent} from 'react'

const ZH= ['星期日', '星期一',  '星期二',  '星期三',  '星期四',  '星期五',  '星期六'];
const EN= ['SUN', 'MON',  'TUE',  'WED',  'THU',  'FRI',  'SAT'];

export default class DateShow extends PureComponent {
	render() {
		const now = new Date();
		const week = now.getDay();
		return (
			<div style={{width: '223px',flexShrink:'0', marginRight:'20px', position: 'relative',overflow:'hidden', background: '#fff', height:'189px', borderRadius:'12px', boxShadow: '0px 1px 13px 0px rgba(0,79,143,0.1)'}}>
				<p style={{
					fontFamily:'DINCondensed-Bold',
					fontSize: '120px',
					color: 'rgba(51,51,51,.1)',
					marginBottom: '0',
					lineHeight: '1',
					position: 'absolute',
					right: '-6px',
				}}>{EN[week]}</p>
				<p style={{
					fontFamily:'PingFangSC-Medium',
					fontSize: '32px',
					color: '#000',
					lineHeight: '45px',
					padding: '94px 0 0 28px',
					marginBottom: '0'
				}}>{ZH[week]}</p>
				<p style={{
					fontSize:'16px',
					fontFamily:'PingFangSC-Light',
					color:'rgba(0,0,0,1)',
					marginBottom: '0',
					paddingLeft: '28px',
					lineHeight: '22px'
				}}>{`${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`}</p>
			</div>
		)
	}
}
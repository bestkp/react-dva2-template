import {Popover} from 'antd'
const sty = {
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap'
}
const weeks = [
	{
		index: 1,
		key: 'mon',
		value: '星期一'
	},
	{
		index: 2,
		key: 'tue',
		value: '星期二'
	},
	{
		index: 3,
		key: 'wed',
		value: '星期三'
	},{
		index: 4,
		key: 'thu',
		value: '星期四'
	},{
		index: 5,
		key: 'fri',
		value: '星期五'
	},{
		index: 6,
		key: 'sat',
		value: '星期六'
	},{
		index: 0,
		key: 'sun',
		value: '星期日'
	},
]
const getStrLength = (str) => {
	return str ? str.replace(/[\u0391-\uFFE5]/g,"aa").length : 0;
};
const setContent = (text, len=16, end=6) => {
	return getStrLength(text) > len ? <Popover content={text} title="">
		<span style={sty}>{text.substring(0, end)+'...'}</span>
	</Popover>: <span>{text}</span>;
}
const columns = [
	{
		title: '编号',
		key: 'id',
		width: '8%',
		render: text => <span>{text}</span>
	}, {
		title: '工单标签',
		key: 'tag_class',
		width: '16%',
	}, {
		title: '描述',
		key: 'tag_name',
		width: '20%',
	}, {
		title: '部门',
		key: 'data_type',
		width: '16%',
	}, {
		title: '处理人',
		key: weeks.filter(week => week.index == new Date().getDay())[0]['key'],
		width: '16%',
	}, {
		title: '操作',
		key: 'operation',
		width: '6%',
	}
]



export default {
	columns,
	weeks,
}
import {Popover} from 'antd'
export const tabs = [
	{
		key: 6,
		name: '全部',
	},{
		key: 1,
		name: '待领取',
	},{
		key: 3,
		name: '处理中',
	},{
		key: 4,
		name: '已处理',
	},{
		key: 2,
		name: '已关闭',
	}
]
const sty = {
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap'
}
const getStrLength = (str) => {
	return str && str.replace(/[\u0391-\uFFE5]/g,"aa").length;
};
const setContent = (text, len=16, end=6) => {
	return getStrLength(text) > len ? <Popover content={text} title="">
		<span style={sty}>{text.substring(0, end)+'...'}</span>
	</Popover>: <span>{text}</span>;
}
export const columns = [
	{
		title: '工单号',
		key: 'kefu_ticket_id',
		width: 48,
		render: text => {return setContent(text)}
	}, {
		title: '工单标签',
		key: 'classify_id',
		width: '10%',
	}, {
		title: '描述',
		key: 'tag_id',
		width: '8%',
		render: text => {return setContent(text)},
	}, {
		title: '剩余时间',
		key: 'finish_datetime',
		width: '10%',
		render: text => {return setContent(text)},
		sorter: (a, b) => a.finish_datetime - b.finish_datetime,
	}, {
		title: '创建时间',
		key: 'update_at',
		width: '15%',
		sorter: (a, b) => a.update_at - b.update_at,
		render: text => {return setContent(text)}
	}, {
		title: '催单数',
		key: 'kefu_expedites',
		width: '8%',
		sorter: (a, b) => a.kefu_expedites - b.kefu_expedites,
		render: text => <span style={text > 3 ? {color: '#FF6060'}: {}}>{text}</span>
	}, {
		title: '紧急程度',
		key: 'priority_id',
		width: '8%',
	},{
		title: '部门',
		key: 'ticket_type',
		width: '10%',
	},{
		title: '处理人',
		key: 'work_user_id',
		width: '10%',
	},{
		title: '状态',
		key: 'status',
		width: '10%',
	}, {
		title: '操作',
		key: 'operation',
		fixed: 'right',
		width: 60
	}
]


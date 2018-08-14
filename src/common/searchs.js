export const worksSearch = [
	{
		width: '35%',
		name: '工单编号',
		type: 'Input',
		key: 'kefu_ticket_id',
	},
	{
		width: '30%',
		name: '工单标签',
		type: 'Select',
		key: 'classify_id',
		list: []
	},
	{
		width: '35%',
		name: '描述',
		type: 'Select',
		key: 'tag_id',
		list: []
	},
	{
		width: '35%',
		name: '紧急程度',
		type: 'Select',
		key: 'priority_id',
		list: [],
	},
	{
		width: '30%',
		name: '部门',
		type: 'Select',
		key: 'ticket_type',
		list: []
	},
	{
		width: '35%',
		name: '处理人',
		type: 'Select',
		key: 'work_user_id',
		list: []
	},
]
//分类管理搜索
export const classifySearch = [
	{
		width: '46%',
		name: '部门',
		type: 'Select',
		key: 'ticket_type',
		labelWidth: '82px',
		list: []
	},
	{
		width: '54%',
		name: '工单标签',
		type: 'Select',
		key: 'classify_id',
		list: []
	},
	{
		width: '46%',
		name: '处理人',
		type: 'Select',
		key: 'work_user_id',
		labelWidth: '82px',
		list: []
	},
	{
		width: '54%',
		name: '描述',
		type: 'Select',
		key: 'tag_id',
		list: [],
	},
	
	
]
// 批量处理
export const modalMulHandle = [
	{
		key: 'files',
		width: 210,
		name: '上传附件',
		type: 'Upload',
		desc: '仅支持小于20M的csv文件',
		lineheight: '34px',
		required: true,
	},
]
// 退回操作
export const modalBackForm = [
	{
		key: 'reason',
		width: 328,
		height: 140,
		name: '退回原因',
		type: 'Textarea',
		desc: '退回后此工单将变为待领取状态',
		required: true,
		lineheight: '34px',
	},
	{
		key: 'files',
		width: 210,
		name: '上传附件',
		type: 'Upload',
		desc: '仅支持小于20M的word、excel、图片文件',
		lineheight: '34px',
	},
]
// 处理完毕
export const modalHandleOver = [
	{
		key: 'reason',
		name: '是否需要过河兵回复',
		type: 'Radio',
		required: true,
		lineheight: 'normal'
	},
	{
		key: 'handleDesc',
		width: 328,
		height: 140,
		name: '处理说明',
		type: 'Textarea',
		required: true,
		max: 500,
		lineheight: '34px',
	},
	{
		key: 'files',
		width: 210,
		name: '上传附件',
		type: 'Upload',
		desc: '仅支持小于20M的word、excel、图片文件',
		lineheight: '34px',
	},
]
// 流转
export const modalFlow = [
	{
		key: 'issuedId',
		name: '处理人',
		type: 'Select',
		required: true,
		lineheight: '44px',
	},
	{
		key: 'depart',
		name: '部门',
		type: 'Select',
		lineheight: '44px',
		disabled: true,
	},
	{
		key: 'contents',
		width: 507,
		height: 160,
		name: '备注',
		type: 'Textarea',
		required: true,
		lineheight: '34px',
	},
	{
		key: 'files',
		width: 210,
		name: '上传附件',
		type: 'Upload',
		desc: '仅支持小于20M的word、excel、图片文件',
		lineheight: '34px',
	},
]
// 指派
export const modalAssign = [
	{
		key: 'issuedId',
		name: '处理人',
		type: 'Select',
		required: false,
		lineheight: '44px',
		width: '50%'
	},
	{
		key: 'depart',
		name: '部门',
		type: 'Select',
		lineheight: '44px',
		width: '50%',
		disabled: true,
	},
	{
		key: 'type',
		name: '工单标签',
		type: 'Select',
		required: false,
		lineheight: '44px',
		width: '50%'
	},
	{
		key: 'issue',
		name: '描述',
		type: 'Select',
		required: false,
		lineheight: '44px',
		width: '50%'
	},
	{
		key: 'level',
		name: '紧急程度',
		type: 'Select',
		required: true,
		lineheight: '44px',
		width: '50%'
	},
	{
		key: 'contents',
		width: 525,
		height: 160,
		name: '备注',
		type: 'Textarea',
		required: true,
		lineheight: '34px',
	},
	{
		key: 'files',
		width: 210,
		name: '上传附件',
		type: 'Upload',
		desc: '仅支持小于20M的word、excel、图片文件',
		lineheight: '34px',
		width: '100%'
	},
]
import {Icon} from 'antd'
export default [
	{
		title: '工单管理',
		icon: <Icon type='file-text'/>,
		fid: "0",
		id: "1",
		route: "/works",
		api: "",
		children: [{
			title: '工单详情',
			icon: '',
			fid: "1",
			id: "1-1",
			route: "/works/detail",
			api: "",
		}]
	},
	{
		title: '分类管理',
		icon: <Icon type='appstore-o'/>,
		fid: "0",
		id: "2",
		is_menu: 1,
		route: "/classify",
		api: "",
		children: [{
			title: '添加分类',
			icon: '',
			fid: "1",
			id: "1-1",
			route: "/classify/edit",
			api: "",
		}]
	},
	// {
	// 	title: '数据看板',
	// 	icon: <Icon type='line-chart'/>,
	// 	fid: "0",
	// 	id: "3",
	// 	is_menu: 1,
	// 	route: "/datamap",
	// 	api: ""
	// },
	// {
	// 	title: '处理详情',
	// 	icon: <Icon type='info-circle-o'/>,
	// 	fid: "0",
	// 	id: "4",
	// 	is_menu: 1,
	// 	route: "/process",
	// 	api: ""
	// },
]
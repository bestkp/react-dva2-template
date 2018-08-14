import menuList from './menuList'
import * as searchs from './searchs'
const WORK_STATUS = {
	1: '待领取',
	2: '已关闭',
	3: '处理中',
	4: '已处理',
	5: '退回'
}
const TAG_TYPE = {
	'一般': 'primary',
	'重要': 'important',
	'紧急': 'urgency',
	'特急': 'urgencyer'
	
}

export {
	menuList,
	searchs,
	WORK_STATUS,
	TAG_TYPE,
}
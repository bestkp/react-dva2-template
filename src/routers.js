/* eslint-disable no-tabs */
/**
 * Create by lihongyang on 2017/12/11
 */
export const baseRoutes = [
	{
		path: '/login',
		models: () => [import('./models/login')],
		component: () => import('./routes/login'),
	},
	{
		path: '/works',
		models: () => [import('./models/works')],
		component: () => import('./routes/works'),
	},
	{
		path: '/datashow',
		models: () => [import('./models/datashow')],
		component: () => import('./routes/datashow'),
	},
	{
		path: '/works/detail',
		models: () => [import('./models/works')],
		component: () => import('./routes/works/worksDetail'),
	},
	{
		path: '/classify',
		models: () => [import('./models/classify')],
		component: () => import('./routes/classify'),
	},
	{
		path: '/classify/edit',
		models: () => [import('./models/classify')],
		component: () => import('./routes/classify/classifyDetail'),
	},
	{
		path: '/datamap',
		models: () => [import('./models/works')],
		component: () => import('./routes/works'),
	},
	{
		path: '/process',
		models: () => [import('./models/works')],
		component: () => import('./routes/works'),
	},
]

export const businessRoutes = []

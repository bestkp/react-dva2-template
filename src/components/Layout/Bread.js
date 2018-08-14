import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import {Link} from 'dva/router'
// import pathToRegexp from 'path-to-regexp'
import { queryArray } from 'utils'
import flattenOptions from 'utils/flattenOptions'
import styles from './Bread.less'

const Bread = ({ location, menuList, back }) => {
	let breadcrumbNameMap = {};
	let flatMenu = flattenOptions(menuList)
	flatMenu.forEach(fm => {
		breadcrumbNameMap[fm['route']] = fm['title']
	})
	const pathSnippets = location.pathname.split('/').filter(ps => ps);
	const breadcrumbItems = pathSnippets.map((_, index) => {
		const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
		return (
			<Breadcrumb.Item key={url}>
				{
					(index+1) === pathSnippets.length ?
						<span style={{color: '#333'}}>{breadcrumbNameMap[url]}</span> :
						<Link to={url}>
							{breadcrumbNameMap[url]}
						</Link>
				}
			</Breadcrumb.Item>
		);
	});
    return (
	    <div className={styles.bread}>
	        <Icon onClick={back} className={styles.backIcon} type="left" />
	        <Breadcrumb className={styles.breadFont}>
		        {breadcrumbItems}
	        </Breadcrumb>
        </div>
    )
}

Bread.propTypes = {
    menuList: PropTypes.array,
    location: PropTypes.object,
	back: PropTypes.func
}

export default Bread

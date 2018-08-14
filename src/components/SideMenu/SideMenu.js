import React, {PureComponent} from 'react'
import {Link} from 'dva/router'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import styles from './SideMenu.less'
const cls = classnames.bind(styles);

export default class SideMenu extends PureComponent{
	constructor(props) {
		super(props);
	}
	render() {
		const {menuList, location} = this.props;
		return (
			<div className={styles.sideMenu}>
				<ul className={styles.menu}>
					{menuList.map(ml => {
						return <li key={ml.id} className={cls({menuLi: true, selected: location.pathname.startsWith(ml.route)})}>
							 <Link className={styles.item} to={ml.route}>
								 {/*{ml.icon}*/}
								 {/*<img style={{}} src={icons[ml.icon]} alt=""/>*/}
								 <i className={cls({icon: true, [ml.icon]: true})}></i>
								 {ml.title}
							 </Link>
						</li>
					})}
				</ul>
			</div>
		)
	}
	
}
SideMenu.propTypes = {
	menuList: PropTypes.array,
	location: PropTypes.object
}
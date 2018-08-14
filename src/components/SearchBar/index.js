/**
 * Create by lihongyang on 2018/3/15
 * searchSource: 配置项
 * onSearch： 方法
 * list： 数据
 * cols： 列数
 */
import React, {Component, PropTypes} from 'react';
import {Row, Col, Input, Select, DatePicker} from 'antd';
import {CButton} from 'components'
const Option = Select.Option;
import moment from 'moment';
import styles from './index.less'
/**
 * searchSource
 * {
 *
 *      width: form的宽
 *      name: 标签名或btn名
 *      type: 对应的antd标签
 *      key: 组件的对应的state key值
 * }
 */

class SearchBar extends Component {
    constructor(props) {
        super(props)
	    this.state = {}
        this.typeMap = {
            'Input': this.renderInput,
            'Select': this.renderSelect,
            'DatePicker': this.renderDatePicker,
        }
    }
	
	onInputChange = (key, e) => {
		this.setState({
			[key]: e.target.value,
		})
	}
	
	onSelChange = (key, e) => {
		this.setState({
			[key]: e,
		})
	}
	
    renderInput = (key, list=[]) => {
        return <Input placeholder="请输入" onChange={this.onInputChange.bind(this, key)} style={{width: '100%'}} />
    }
    renderSelect = (key, list=[]) => {
    	const lists = list['list'];
    	const value = list['value'];
    	const all = [<Option key={-1} value='0'>全部</Option>]
	    let options = all;
    	if(['ticket_type', 'priority_id'].includes(key)) {
    		options = [...all, ...lists.map((item,index) =>
			    <Option value={item.id} key={item.id}>{item.group_name}</Option>
		    )]
	    } else if(key === 'work_user_id') {
		    options = [...all, ...lists.map((item,index) =>
			    <Option value={`${item.id}`} key={item.id}>{item.name}</Option>
		    )]
	    } else {
    	    for(var ls in lists) {
    	    	options.push(<Option value={ls} key={ls}>{lists[ls]}</Option>)
	        }
	    }
        return <Select
	                showSearch
	                disabled={list['disabled']}
	                value={this.state[key] || value}
	                optionFilterProp="children"
	                placeholder="请选择"
	                onChange={this.onSelChange.bind(this, key)}
	                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
	                style={{width: '100%'}} >
            {options}
        </Select>
    }
    renderDatePicker = (props, list) => {
        return<DatePicker style={{width: '100%'}} size="large"
            value={ props.value === 'Invalid date' ?  null : moment(props.value, 'YYYY-MM-DD')}
            onChange={(e) => props.onChange(moment(e).format('YYYY-MM-DD'))}
        />
    }

    render() {
        const {searchSource, onSearch, list, cols=3, children} = this.props;
        const winWidth = window.innerWidth;
        return (
            <div className={styles.rowStyle}>
	            <Row type="flex" gutter={8} style={{flex: 1}}>
		            {
			            searchSource.map((item, idx) => {
			            	console.log(item.labelWidth)
				            return <Col className={styles.searchItem} key={idx} style={{marginBottom: idx<cols?'29px':0, width: item.width}}>
					                <span className={styles.label} style={{width: item.labelWidth ? item.labelWidth: ''}}>{item.name}</span>
					            <div className={styles.eachForm}>{this.typeMap[item.type](item.key, list[item.key])}</div>
				            </Col>
			            })
		            }
	            </Row>
	            <div className={styles.right}>
		            <CButton onClick={() => {onSearch(this.state)}} size="large">检索</CButton>
		            {children}
	            </div>
            </div>
        )
    }
}

export default SearchBar

// const searchSource = [
//     {
//         col: 6,
//         name: '实验名称',
//         type: 'Input',
//         props: {
//             onChange: (e) => this.setState({keyword: e.target.value}),
//             value: this.state.keyword,
//         },
//     },{
//         col: 6,
//         name: '类型',
//         type: 'Select',
//         list: [{id: 1, name: '全职'}, {id: 2, name:'兼职'}, {id: 3, name: '实习'} ],
//         props: {
//             onChange: (e) => this.setState({keyword: e}),
//             value: this.state.keyword,
//         },
//     },
//     {
//         col: 6,
//         name: '日期',
//         type: 'DatePicker',
//         props: {
//             onChange: (e) => this.setState({test: e}),
//             value: this.state.test,
//         },
//     },
//     {
//         col: 2,
//         name: '搜索',
//         type: 'Button',
//         props: {
//             type: 'primary',
//             onClick: () => this.getabListService({keyword: this.state.keyword, start: (this.state.pageNum - 1) * 10, limit: 10})
//         },
//     },
//     {
//         col: 3,
//         name: '新建',
//         type: 'Button',
//         href: '#/platformPower/strategyMgmt/-1',
//         props: {
//             type: 'primary',
//             icon: 'plus',
//         },
//     }
// ];

import React from 'react';
import { Popover } from 'antd';

const tableColumns = {};

tableColumns.generateTableColumns = (columnsArray) => {
	return columnsArray.map(item => {
		return {
			title: <span style={{textAlign: 'center', whiteSpace: 'nowrap'}}>{item.title}</span>,
			dataIndex: item.key,
			key: item.key,
			sorter: item.sorter || false,
			fixed: item.fixed || '',
			width: item.width || 'auto',
			render: typeof item.render === 'function' ? item.render : text => <span style={{display: 'block',  whiteSpace: 'nowrap'}}>{text || '-'}</span>,
		}
	})
}

export default tableColumns;

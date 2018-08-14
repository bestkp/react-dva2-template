import React, {PureComponent} from 'react'
import {CountTextArea} from 'components'
import {Upload, Button, Radio, Input, Select, message} from 'antd'
const RadioGroup = Radio.Group;

class RenderForm extends PureComponent {
	constructor(props) {
		super(props)
	}
	
	render() {
		const {type} = this.props;
		switch (type) {
			case 'Textarea':
				return <CountTextArea style={that.state.invalid && that.state.textarea ? {}: {border: '1px solid #FF3B30'}} width={item.width} height={item.height} value={that.state.textarea} onTextAreaChange={that.onTextAreaChange}></CountTextArea>
				break;
			case 'Upload':
				return <Upload
					action= {`${API}/api/upload`}
					listType='picture'
					fileList={that.state.fileList}
					className="upload-list-inline"
					onChange={that.onFileChange}
					beforeUpload={beforeUpload}
				>
					<Button style={{color: '#289fff',borderColor: '#289fff'}}>选择附件</Button>
				</Upload>
				break;
			case 'Radio':
				return <RadioGroup onChange={that.onRadioChange} value={that.state.reply}>
					<Radio value={0}>需要回复</Radio>
					<Radio value={1}>不需要回复</Radio>
				</RadioGroup>
				break;
			case 'Input':
				return <Input />
				break;
			case 'Select':
				return <Select></Select>
		}
	}
}
export default RenderForm

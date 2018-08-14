import {CountTextArea} from 'components'
import {Upload, Button, Radio, Input, Select, message} from 'antd'
const RadioGroup = Radio.Group;

const renderForm = {}

const beforeUpload = (file) => {
	const isRight = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	
	if (!isRight) {
		message.error('文件格式有误');
	}
	const isLt20M = file.size / 1024 / 1024 < 20;
	if (!isLt20M) {
		message.error('文件不能超过20M');
	}
	return isRight && isLt20M;
}
renderForm.render = function (item, that) {
	switch(item.type) {
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


export default renderForm;
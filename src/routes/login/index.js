import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Button, Form, Input, Alert} from 'antd'
import {config} from 'utils'
import styles from './index.less'
import classnames from 'classnames/bind'

const FormItem = Form.Item

class Login extends Component {
    constructor(props) {
        super(props)
    }

    handleOk = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return
            }
            this.props.dispatch({type: 'login/login', payload: values})
        })
    }

    getCodeBtnHandleClick = (checkToken) => {
        this.props.dispatch({type: 'login/getMsgCode', payload: {checkToken}})
    }

    render() {
        const {
            loading,
            dispatch,
            form: {
                getFieldDecorator,
            },
            login: {errorMsg, isShowCodeBtn, checkToken, isLoginByMsg},
        } = this.props;

        return (
            <div className={classnames.bind(styles)({form: true, loginMsgError: errorMsg && isLoginByMsg})}>
                <div className={styles.logo}>
                    <img alt={'logo'} src={config.logo} />
                    <span>{config.name}</span>
                </div>
                <form>
                    <FormItem hasFeedback>
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                },
                            ],
                        })(<Input size="large" onPressEnter={this.handleOk} placeholder="mobile"/>)}
                    </FormItem>
                    <FormItem hasFeedback>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                },
                            ],
                        })(<Input size="large" type="password" onPressEnter={this.handleOk} placeholder="password"/>)}
                    </FormItem>
                    {
                        isLoginByMsg ?
                            <FormItem label="验证码" labelCol={{span: 6}} wrapperCol={{span: 17, offset: 1}}>
                                {getFieldDecorator('verify', {
                                    rules: [{required: true, message: '请输入验证码'}],
                                })(
                                    <Input placeholder="请输入验证码" style={{width: '100%'}}/>
                                )}
                            </FormItem> : null
                    }
                    {
                        errorMsg ? <Alert message={errorMsg} style={{marginBottom: 0}} type="error" showIcon/> : null
                    }
                    {
                        !isShowCodeBtn ?
                            <FormItem>
                                <Button type="primary" size="large" style={{backgroundColor: '#0099FF'}} onClick={this.handleOk} loading={loading.effects.login}>
                                    Sign in
                                </Button>
                            </FormItem> :
                            <FormItem>
                                <Button type="primary"
                                        onClick={this.getCodeBtnHandleClick.bind(this, checkToken)}
                                        style={{
                                            width: '100%',
                                            backgroundColor: 'rgb(33, 185, 187)',
                                            borderColor: 'rgb(33, 185, 187)',
                                        }}
                                >获取验证码</Button>
                            </FormItem>
                    }
                </form>
            </div>
        )
    }
}

Login.propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
}

export default connect(({loading, login}) => ({loading, login}))(Form.create()(Login))

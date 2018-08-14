import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Loader from '../Loader'
import styles from './Page.less'

export default class Page extends Component {
    constructor(...args) {
        super(...args)
        this.state = {
            firstLoad: true
        }
        this.st = '';
    }

    componentDidMount() {
        this.st = setTimeout(() => this.setState({firstLoad: false}), 600)
    }

    componentDidUpdate() {
        this.st && this.state.firstLoad && clearTimeout(this.st)
        this.state.firstLoad && (this.st = setTimeout(() => this.setState({firstLoad: false}), 600))
    }

    render () {
        const { className, children, loading = false, inner = false } = this.props
        const {firstLoad} = this.state
        const loadingStyle = {
            height: 'calc(100vh - 48px)',
            overflow: 'hidden',
        }
        return (
            <div
                className={classnames(className, {
                    [styles.contentInner]: inner,
                })}
                style={loading ? loadingStyle : null}
            >
                {loading && firstLoad ? <Loader spinning /> : ''}
                {children}
            </div>
        )
    }
}


Page.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    loading: PropTypes.bool,
    inner: PropTypes.bool,
}

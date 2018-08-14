/* eslint-disable indent */
import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'
import {baseRoutes, businessRoutes} from './routers'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
    const error = dynamic({
        app,
        component: () => import('./routes/error'),
    })
    const routes = [].concat(baseRoutes, businessRoutes)

    return (
        <ConnectedRouter history={history}>
            <App>
                <Switch>
                    <Route exact path="/" render={() => (<Redirect to="/works" />)} />
                    {
                        routes.map(({ path, ...dynamics }, key) => (
                            <Route key={key}
                                exact
                                path={path}
                                component={dynamic({
                                    app,
                                    ...dynamics,
                                })}
                            />
                        ))
                    }
                    <Route component={error} />
                </Switch>
            </App>
        </ConnectedRouter>
    )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers

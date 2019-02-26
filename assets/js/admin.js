'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from 'react-router-dom'
import Progress from './components/Progress'
import appReducer from './reducers'
import adminReducer from './reducers/admin'
import { fetchAdminData, patchUser, patchPublisher } from './actions/admin'
import Util from './lib/Util'
import Icon from './components/Icon'

import '../styles/admin.scss'
import './containers/listitem.scss'

const reducer = Util.combineReducers(appReducer, adminReducer)

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      error: '',
      user: {
        id: '',
        email: '',
        password: '',
        currentPassword: ''
      },
      users: [],
      publishers: [],
      working: false
    }

    this.dispatch = this.dispatch.bind(this)
    this.getRegisteredUsers = this.getRegisteredUsers.bind(this)
    this.getRegisteredPublishers = this.getRegisteredPublishers.bind(this)

    /*
    this.state.user = {
      ...this.state.user,
      'created_at': 1551151466802,
      'updated_at': 1551151520134,
      'id': 1,
      'email': 'admin@tkluge.net',
      'admin': true
    }
    */
  }
  dispatch (action) {
    if (!action) throw new Error('dispatch: missing action')
    if (action instanceof Function) {
      action(this.dispatch, () => this.state)
    } else {
      const changes = reducer(this.state, action)
      if (!changes || !Object.keys(changes).length) return
      this.setState({
        ...changes
      })
    }
  }
  componentDidMount () {
    this.dispatch(fetchAdminData())
  }
  getRegisteredUsers () {
    return this.state.users.map(user => {
      return (
        <li className='uri-list-item flex-container' key={`is-admin-${user.id}`}>
          <span className='flex'>{user.email}</span>
          <span className='flex'>
            <label for={`is-admin-${user.id}`} className='cb-label'>Admin?</label>
            <input className='checkbox' type='checkbox' checked={user.admin} onChange={() => this.dispatch(patchUser({ id: user.id, admin: !user.admin }))} id={`is-admin-${user.id}`} />
            <label htmlFor={`is-admin-${user.id}`} />
          </span>
          <div className='stack flex flex-container flex-vertical'>
            <span className='flex'><span className='key'>Created at:</span><span className='value'>{new Date(user.created_at).toLocaleString()}</span></span>
            <span className='flex'><span className='key'>Updated at:</span><span className='value'>{new Date(user.updated_at).toLocaleString()}</span></span>
          </div>
        </li>
      )
    })
  }
  getRegisteredPublishers () {
    return this.state.publishers.map(pub => {
      return (
        <li className='uri-list-item flex-container flex-vertical' key={`is-whitelisted-${pub.id}`}>
          <header><h3>{pub.name}</h3></header>
          <div className='flex flex-container'>
            <div className='flex flex-container flex-vertical key-value'>
              <span className='flex'><span className='key'>Owner:</span><span className='value'>{pub.user.email}</span></span>
              <span className='flex'><span className='key'>App ID:</span><span className='value'>{pub.appid}</span></span>
              <span className='flex contains-icon'>
                <span className='key'>App domain:</span>
                <span className='value'>{pub.url}</span>
                <Icon icon={pub.verified ? 'shield-check' : 'alert-circle'} className={pub.verified ? 'verified' : 'unverified'} />
              </span>
            </div>
            <span className='flex'>
              <label htmlFor={`is-whitelisted-${pub.id}`} className='cb-label'>Whitelisted?</label>
              <input className='checkbox' type='checkbox' checked={pub.whitelisted} onChange={() => this.dispatch(patchPublisher({ id: pub.id, whitelisted: !pub.whitelisted }))} id={`is-whitelisted-${pub.id}`} />
              <label htmlFor={`is-whitelisted-${pub.id}`} />
            </span>
            <div className='stack flex flex-container flex-vertical'>
              <span className='flex'><span className='key'>Created at:</span><span className='value'>{new Date(pub.created_at).toLocaleString()}</span></span>
              <span className='flex'><span className='key'>Updated at:</span><span className='value'>{new Date(pub.updated_at).toLocaleString()}</span></span>
            </div>
          </div>
        </li>
      )
    })
  }
  render () {
    return (
      <Router basename='/admin'>
        <div className='root-container flex-container admin-container'>
          <aside className='nav nav-left'>
            <header>
              <h1>RoE Admin</h1>
              <h2 className='flex-container'>
                <span className='flex'>{this.state.user.email}</span>
                <a href='/logout'>Log out</a>
              </h2>
            </header>
            <ul>
              <li><NavLink to='/users'>Users</NavLink></li>
              <li><NavLink to='/publishers'>Publishers</NavLink></li>
              <li><a href='/keys'>Exit admin</a></li>
            </ul>
          </aside>
          <section className={'content flex' + (this.state.working ? ' working' : '')}>
            <Progress bound />
            {this.state.error && <div className='error-box'>{this.state.error}</div>}
            <Switch>
              <Route path='/users' exact children={props => (
                <div>
                  <header className='flex-container'>
                    <div className='flex'>
                      <h1>Site users</h1>
                      <h2>Registered users on RoE</h2>
                    </div>
                  </header>
                  <ul className='list'>
                    {this.getRegisteredUsers()}
                  </ul>
                </div>
              )} />

              <Route path='/publishers' exact children={props => (
                <div>
                  <header className='flex-container'>
                    <div className='flex'>
                      <h1>Publishers</h1>
                      <h2>Whitelist sites who can publish books</h2>
                    </div>
                  </header>
                  <ul className='list'>
                    {this.getRegisteredPublishers()}
                  </ul>
                </div>
              )} />

              <Route path='/' render={() => <Redirect to='/users' />} />
            </Switch>
          </section>
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

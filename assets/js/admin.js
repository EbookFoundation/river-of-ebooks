'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from 'react-router-dom'
import Progress from './components/Progress'
import appReducer from './reducers'
import adminReducer from './reducers/admin'
import { fetchAdminData } from './actions/admin'
import Util from './lib/Util'

import '../styles/admin.scss'

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
            <input className='checkbox' type='checkbox' defaultChecked={user.admin} id={`is-admin-${user.id}`} />
            <label for={`is-admin-${user.id}`} />
          </span>
          <div className='stack flex flex-container flex-vertical'>
            <span>{user.created_at}</span>
            <span>{user.updated_at}</span>
          </div>
        </li>
      )
    })
  }
  getRegisteredPublishers () {
    return this.state.publishers.map(pub => {
      return (
        <li className='uri-list-item flex-container' key={`is-whitelisted-${pub.id}`}>
          <div className='stack flex flex-container flex-vertical'>
            <span className='flex'><span className='name'>{pub.url}</span><span className='appid'>{pub.appid}</span></span>
            <span className='flex'>{pub.user.email}</span>
          </div>
          <span className='flex'>
            <label for={`is-whitelisted-${pub.id}`} className='cb-label'>Whitelisted?</label>
            <input className='checkbox' type='checkbox' defaultChecked={pub.whitelisted} id={`is-whitelisted-${pub.id}`} />
            <label for={`is-whitelisted-${pub.id}`} />
          </span>
          <div className='stack flex flex-container flex-vertical'>
            <span>{pub.created_at}</span>
            <span>{pub.updated_at}</span>
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
              <li><a href='/targets'>Exit admin</a></li>
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

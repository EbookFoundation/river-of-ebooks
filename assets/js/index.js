'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from 'react-router-dom'
import Progress from './components/Progress'
import UnderlineInput from './components/UnderlineInput'
import UriListItem from './containers/UriListItem'
import reducer from './reducers'
import { fetchData, createNewUrl, setEditing, editUser, createNewPublisher } from './actions'

import '../styles/index.scss'

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
      urls: [],
      publishers: [],
      newPublisherUrl: '',
      editingUrl: null,
      working: false
    }

    this.dispatch = this.dispatch.bind(this)
    this.getRegisteredUris = this.getRegisteredUris.bind(this)
    this.setUserValue = this.setUserValue.bind(this)
    this.saveUser = this.saveUser.bind(this)
    this.getRegisteredPublishers = this.getRegisteredPublishers.bind(this)
    this.setPublisherUrl = this.setPublisherUrl.bind(this)
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
    this.dispatch(fetchData())
  }
  setPublisherUrl (e) {
    this.setState({
      newPublisherUrl: e.target.value
    })
  }
  getRegisteredUris () {
    return this.state.urls.map((item, i) => {
      return (<UriListItem
        key={i}
        dispatch={this.dispatch}
        item={item}
        editing={this.state.editingUrl === item.id} />)
    })
  }
  setUserValue (which, e) {
    this.setState({
      user: {
        ...this.state.user,
        [which]: e.target.value
      }
    })
  }
  saveUser () {
    this.dispatch(editUser(this.state.user))
    this.setState({
      user: {
        ...this.state.user,
        email: this.state.user.email,
        password: '',
        currentPassword: ''
      }
    })
  }
  getRegisteredPublishers () {
    return this.state.publishers.map((item, i) => {
      return (<PublisherListItem
        key={i}
        dispatch={this.dispatch}
        item={item} />)
    })
  }
  render () {
    return (
      <Router>
        <div className='root-container flex-container' onClick={() => this.dispatch(setEditing(null))}>
          <aside className='nav nav-left'>
            <header>
              <h1>River of Ebooks</h1>
              <h2 className='flex-container'>
                <span className='flex'>{this.state.user.email}</span>
                <a href='/logout'>Log out</a>
              </h2>
            </header>
            <ul>
              <li><NavLink to='/targets'>Push URIs</NavLink></li>
              <li><NavLink to='/account'>My account</NavLink></li>
              <li><NavLink to='/keys'>Publishing keys</NavLink></li>
            </ul>
          </aside>
          <section className={'content flex' + (this.state.working ? ' working' : '')}>
            <Progress bound />
            {this.state.error && <div className='error-box'>{this.state.error}</div>}
            <Switch>
              <Route path='/targets' exact children={props => (
                <div>
                  <header className='flex-container'>
                    <div className='flex'>
                      <h1>Push URIs</h1>
                      <h2>Newly published books will be sent to these addresses.</h2>
                    </div>
                    <button className='btn' onClick={() => this.dispatch(createNewUrl())}>New address</button>
                  </header>
                  <ul className='list'>
                    {this.getRegisteredUris()}
                  </ul>
                </div>
              )} />
              <Route path='/keys' exact children={props => (
                <div>
                  <header className='flex-container'>
                    <div className='flex'>
                      <h1>Publishing keys</h1>
                      <h2>If you own a publishing site, generate a publishing key for it here.</h2>
                    </div>
                  </header>
                  <div className='creator flex-container'>
                    <UnderlineInput
                      className='flex'
                      placeholder='Site URL'
                      value={this.state.newPublisherUrl}
                      onChange={this.setPublisherUrl} />
                    <button className='btn' onClick={() => this.dispatch(createNewPublisher(this.state.newPublisherUrl))}>Create keys</button>
                  </div>
                  <ul className='list'>
                    {this.getRegisteredPublishers()}
                  </ul>
                </div>
              )} />

              <Route path='/account' exact children={props => (
                <div>
                  <header className='flex-container'>
                    <div className='flex'>
                      <h1>My account</h1>
                      <h2>User account settings</h2>
                    </div>
                  </header>
                  <section className='inputs'>
                    <UnderlineInput
                      placeholder='Email address'
                      value={this.state.user.email}
                      pattern={/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/}
                      onChange={(e) => this.setUserValue('email', e)} />
                    <UnderlineInput
                      placeholder='Password'
                      type='password'
                      value={this.state.user.password}
                      onChange={(e) => this.setUserValue('password', e)} />
                    <UnderlineInput
                      placeholder='Current password'
                      type='password'
                      value={this.state.user.currentPassword}
                      onChange={(e) => this.setUserValue('currentPassword', e)} />
                    <div className='buttons'>
                      <button className='btn' onClick={this.saveUser}>Save</button>
                    </div>
                  </section>
                </div>
              )} />

              <Route path='/' render={() => <Redirect to='/targets' />} />
            </Switch>
          </section>
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

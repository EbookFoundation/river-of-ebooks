'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import Progress from './components/Progress'
import UriListItem from './containers/UriListItem'
import reducer from './reducers/targets'
import { fetchUrls, createNewUrl, setEditing } from './actions/targets'
import '../styles/targets.scss'

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      error: '',
      user: {
        email: '',
        password: ''
      },
      urls: [{
        id: 0,
        url: 'http.c.co',
        title: '',
        author: '',
        publisher: '',
        isbn: ''
      },{
        id: 1,
        url: 'd.',
        title: '',
        author: '',
        publisher: '',
        isbn: ''
      },{
        id: 2,
        url: '',
        title: '',
        author: '',
        publisher: '',
        isbn: ''
      }],
      editingUrl: 0,
      working: false
    }

    this.dispatch = this.dispatch.bind(this)
    this.getRegisteredUris = this.getRegisteredUris.bind(this)
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
    this.dispatch(fetchUrls())
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
  render () {
    return (
      <div className='root-container flex-container' onClick={() => this.dispatch(setEditing(null))}>
        <aside className='nav nav-left'>
          <header>
            <h1>RoE</h1>
          </header>
        </aside>
        <section className={'content flex' + (this.state.working ? ' working' : '')}>
          <Progress bound />
          {this.state.error && <div className='error-box'>{this.state.error}</div>}
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
        </section>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

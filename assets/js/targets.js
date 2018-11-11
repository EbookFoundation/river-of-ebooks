'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import Progress from './components/Progress'
import UriListItem from './containers/UriListItem'

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
  getRegisteredUris () {
    return [1, 2, 3].map((item, i) => {
      return (<UriListItem key={i} />)
    })
  }
  render () {
    return (
      <div className='root-container flex-container'>
        <aside className='nav nav-left'>
          <header>
            <h1>RoE</h1>
          </header>
        </aside>
        <section className='content flex'>
          <Progress bound />
          <header className='flex-container'>
            <div className='flex'>
              <h1>Push URIs</h1>
              <h2>Newly published books will be sent to these addresses.</h2>
            </div>
            <button className='btn'>New address</button>
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

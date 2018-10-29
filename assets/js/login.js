import React from 'react'
import ReactDOM from 'react-dom'
import Progress from './components/Progress'
import Carousel, {CarouselItem} from './containers/Carousel'
import UnderlineInput from './components/UnderlineInput'
import reducer from './reducers/login'

import {setEmail, setPassword, setCarousel} from './actions/login'

import STYLE from '../styles/login.scss'

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      carouselPosition: 1,
      emailError: null,
      passwordError: null,
      user: {
        email: '',
        password: ''
      }
    }

    this.dispatch = this.dispatch.bind(this)
    this.getEmailInputs = this.getEmailInputs.bind(this)
    this.getPasswordInputs = this.getPasswordInputs.bind(this)
    this.getPasswordHeader = this.getPasswordHeader.bind(this)
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
  getEmailInputs () {
    return [
      <UnderlineInput
        key={0}
        type='text'
        name='email'
        placeholder='Email'
        onChange={e => this.dispatch(setEmail(e.target.value))}
        value={this.state.user.email} />
    ]
  }
  getPasswordInputs () {
    return [
      <UnderlineInput
        key={0}
        type='password'
        name='password'
        placeholder='Password'
        onChange={e => this.dispatch(setPassword(e.target.value))}
        value={this.state.user.password} />
    ]
  }
  getPasswordHeader () {
    return (
      <section className='account-banner flex-container'>
        <div className='stack flex'>
          <span className='email'>{this.state.user.email}</span>
        </div>
        <a href='#' onClick={() => this.dispatch(setCarousel(1))}>Not you?</a>
      </section>
    )
  }
  render () {
    return (
      <div className='root-container flex-container flex-center'>
        <section className='window'>
          <Progress />
          <Carousel position={this.state.carouselPosition} >
            <CarouselItem
              header='Sign up'
              inputs={this.getEmailInputs()}
              error={this.state.emailError}
              button='Sign up'
              onButtonClick={() => null}
              smallButton='Have an account?'
              onSmallButtonClick={() => this.dispatch(setCarousel(1))}
              footer='Sign up with your Google account' />

            <CarouselItem
              header='Sign in'
              inputs={this.getEmailInputs()}
              error={this.state.emailError}
              button='Next'
              onButtonClick={() => this.dispatch(setCarousel(2))}
              smallButton='Create account'
              onSmallButtonClick={() => this.dispatch(setCarousel(0))}
              footer='Sign in with your Google account' />

            <CarouselItem
              header='Welcome'
              headerExtraContent={this.getPasswordHeader()}
              inputs={this.getPasswordInputs()}
              error={this.state.passwordError}
              button='Sign in'
              onButtonClick={() => null}
              smallButton='Forgot password?'
              onSmallButtonClick={() => this.dispatch(setCarousel(3))} />
          </Carousel>
        </section>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

import React from 'react'
import ReactDOM from 'react-dom'
import Progress from './components/Progress'
import Carousel, {CarouselItem} from './containers/Carousel'
import UnderlineInput from './components/UnderlineInput'

import STYLE from '../styles/login.scss'

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      carouselPosition: 0,
      emailError: null,
      passwordError: null,
      user: {
        email: 'x@y.z',
        image: 'https://placehold.it/50x50'
      }
    }

    this.getEmailInputs = this.getEmailInputs.bind(this)
    this.getPasswordInputs = this.getPasswordInputs.bind(this)
    this.getPasswordHeader = this.getPasswordHeader.bind(this)
  }
  getEmailInputs () {
    return [
      <UnderlineInput
        key={0}
        type='email'
        placeholder='Email' />
    ]
  }
  getPasswordInputs () {
    return (
      <UnderlineInput
        key={0}
        type='password'
        placeholder='Password'
        autoComplete='new-password' />
    )
  }
  getPasswordHeader () {
    return (
      <section className='account-banner'>
        <img src={this.state.user.image} alt='user profile image' />
        <div className='stack flex-container flex-center'>
          {/* <span className='name'>firstname lastname</span> */}
          <span className='email'>{this.state.user.email}</span>
        </div>
        <a href='#'>Not you?</a>
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
              header='Sign in'
              inputs={this.getEmailInputs()}
              error={this.state.emailError}
              button='Next'
              smallButton='Create account'
              footer='Sign in with your Google account' />

            <CarouselItem
              header='Welcome'
              headerExtraContent={this.getPasswordHeader()}
              inputs={this.getPasswordInputs()}
              error={this.state.passwordError}
              button='Sign in'
              smallButton='Forgot password?' />
          </Carousel>
        </section>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

import React from 'react'
import ReactDOM from 'react-dom'
import Progress from './components/Progress'
import Carousel, {CarouselItem} from './containers/Carousel'

const App = () => {
  // I will tidy this later
  return (
    <div className="root-container flex-container flex-center">
      <section className="login-window">
        <Progress />
        <Carousel className="modal">
          <CarouselItem>
            <header className="modal-header">
              <h1>Sign in</h1>
            </header>
            <div className="underlined-input">
              <input type="email" name="email" id="email-input" />
              <div className="reacts-to">
                <label className="input-placeholder">Email</label>
                <div className="input-underline">
                  <div className="input-underline-fill"></div>
                </div>
              </div>
            </div>
            <span className="carousel-input-error" id="email-error">&emsp;</span>
            <div className="button-row">
              <a href="signup">Create account</a>
              <button className="btn btn-primary" id="btn-next">
                Next
                <link className="rippleJS" />
              </button>
            </div>
            <div className="footer-row">
              <a href="#">Sign in with your Google account</a>
            </div>
          </CarouselItem>
          <CarouselItem>
            <header className="modal-header">
              <h1>Welcome</h1>
              <section className="account-banner">
                <img src="https://placehold.it/50x50" alt="user profile image" id="card-image" />
                <div className="info-stack">
                  <span className="name" id="card-name">firstname lastname</span>
                  <span className="email" id="card-email">x@y.z</span>
                </div>
                <a href="#" id="btn-reset">Not you?</a>
              </section>
            </header>
            <div className="underlined-input">
              <input type="password" name="password" id="password-input" autoComplete="new-password" />
              <div className="reacts-to">
                <label className="input-placeholder">Password</label>
                <div className="input-underline">
                  <div className="input-underline-fill"></div>
                </div>
              </div>
            </div>
            <span className="carousel-input-error" id="password-error">&emsp;</span>
            <div className="button-row">
              <a href="forgot">Forgot password?</a>
              <button className="btn btn-primary" id="btn-finish">
                Sign in
                <link className="rippleJS" />
              </button>
            </div>
          </CarouselItem>
        </Carousel>
      </section>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

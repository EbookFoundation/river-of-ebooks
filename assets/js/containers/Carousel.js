'use strict'

import React from 'react'
import './carousel.scss'

class Carousel extends React.Component {
  constructor () {
    super()
    this.getWidth = this.getWidth.bind(this)
    this.getOffset = this.getOffset.bind(this)
  }
  getWidth () {
    return this.props.children.length * 450
  }
  getOffset () {
    return -this.props.position * 450
  }
  render () {
    return (
      <section className='carousel-container'>
        <div className='carousel' style={{ width: this.getWidth(), left: this.getOffset() }}>
          {this.props.children}
        </div>
      </section>
    )
  }
}

function handleClick (e, fn) {
  e.preventDefault()
  fn(e)
}

const CarouselItem = props => (
  <form className='carousel-item' onSubmit={(e) => handleClick(e, props.onButtonClick)}>
    <header className='modal-header'>
      <h1>{props.header}</h1>
      {props.headerExtraContent}
    </header>
    {props.inputs}
    <span className='carousel-error'>{props.error}</span>
    <div className='button-row'>
      <a onClick={e => handleClick(e, props.onSmallButtonClick)}>{props.smallButton}</a>
      <button className='btn btn-primary' type='submit' >
        {props.button}
      </button>
    </div>
    {props.footers && props.footers.length &&
    <footer className='footer-row'>
      {
        props.footers.map((x, i) => <a key={i} href={props.footerHrefs[i] || '#'}>{x}</a>)
      }
    </footer>}
  </form>
)

export default Carousel
export {
  CarouselItem
}

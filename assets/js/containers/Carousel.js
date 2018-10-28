import React from 'react'

class Carousel extends React.Component {
  render () {
    return (
      <section className="carousel-container">
        <div className="carousel">
          {this.props.children}
        </div>
      </section>
    )
  }
}

const CarouselItem = props => (
  <div className="carousel-item">{props.children}</div>
)

export default Carousel
export {
  CarouselItem
}
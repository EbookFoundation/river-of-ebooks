import React from 'react'
import IconButton from '../components/IconButton'

export default class ConfirmIconButton extends React.Component {
  constructor () {
    super()
    this.state = {
      confirmed: false
    }
    this.onClick = this.onClick.bind(this)
    this.timer = null
  }
  onClick (e) {
    e.stopPropagation()
    if (this.state.confirmed) {
      clearTimeout(this.timer)
      this.setState({ confirmed: false })
      this.props.onClick(e)
    } else {
      this.setState({ confirmed: true })
      this.timer = setTimeout(() => {
        this.setState({ confirmed: false })
      }, 4000)
    }
  }
  render () {
    const { onClick, icon, ...rest } = this.props
    return (
      <IconButton
        {...rest}
        icon={this.state.confirmed ? 'check' : icon}
        className={this.state.confirmed ? 'confirm' : ''}
        onClick={this.onClick} />
    )
  }
}

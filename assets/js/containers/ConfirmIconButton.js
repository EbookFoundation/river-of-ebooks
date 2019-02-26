import React from 'react'
import IconButton from '../components/IconButton'

export default class ConfirmIconButton extends React.Component {
  constructor () {
    super()
    this.state = {
      confirmed: false
    }
    this.onClick = this.onClick.bind(this)
  }
  onClick (e) {
    if (this.state.confirmed) {
      this.props.onClick(e)
    } else {
      this.setState({ confirmed: true })
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

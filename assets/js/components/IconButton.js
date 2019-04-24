'use strict'

import React from 'react'
import Icon from './Icon'
import './iconbutton.scss'

const IconButton = props => {
  return (
    <button className={'button icon' + (props.className ? ' ' + props.className : '')} onClick={props.onClick}>
      <Icon icon={props.icon} />
    </button>
  )
}

export default IconButton

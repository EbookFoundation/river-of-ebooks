'use strict'

import React from 'react'
import IconButton from '../components/IconButton'
import '../../styles/shared/urilistitem.scss'

class UriListItem extends React.Component {
  constructor () {
    super()
  }
  render () {
    return (
      <li className='uri-list-item flex-container'>
        <span className='uri flex'>uri.uri</span>
        <IconButton icon='delete' />
      </li>
    )
  }
}

export default UriListItem

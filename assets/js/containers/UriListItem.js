'use strict'

import React from 'react'
import IconButton from '../components/IconButton'
import UnderlineInput from '../components/UnderlineInput'
import '../../styles/shared/urilistitem.scss'
import { changeUrlField, setUrl, removeUrl } from '../actions/targets'

const uriRegex = /(.+:\/\/)?(.+\.)*(.+\.).{1,}(:\d+)?(.+)?/i

class UriListItem extends React.Component {
  render () {
    return (
      <li className='uri-list-item flex-container'>
        <UnderlineInput
          className='uri flex'
          type='text'
          name={'url-' + this.props.id}
          placeholder='Destination URL'
          value={'' + this.props.url}
          pattern={uriRegex}
          onChange={(e) => this.props.dispatch(changeUrlField(this.props.id, e.target.value))}
          onBlur={(e) => this.props.dispatch(setUrl(this.props.id, e.target.value))} />
        <IconButton icon='delete' onClick={() => this.props.dispatch(removeUrl(this.props.id))} />
      </li>
    )
  }
}

export default UriListItem

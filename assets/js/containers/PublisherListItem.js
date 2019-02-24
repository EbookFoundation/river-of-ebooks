import React from 'react'
import IconButton from '../components/IconButton'
import UnderlineInput from '../components/UnderlineInput'
import { removePublisher } from '../actions'
import '../../styles/shared/listitem.scss'

const uriRegex = /(.+:\/\/)?(.+\.)*(.+\.).{1,}(:\d+)?(.+)?/i

class PublisherListItem extends React.Component {
  render () {
    return (
      <li className='uri-list-item flex-container'>
        <div className='stack flex flex-container flex-vertical'>
          <span className='label'>Website URL</span>
          <span className='value'>{this.props.item.url}</span>
        </div>
        <div className='stack flex flex-container flex-vertical'>
          <span className='label'>Key</span>
          <input className='value' value={this.props.item.key} readOnly={true} />
        </div>
        <div className='stack flex flex-container flex-vertical'>
          <span className='label'>Secret</span>
          <input className='value' value={this.props.item.secret} readOnly={true} />
        </div>
        <IconButton icon='delete' onClick={() => this.props.dispatch(removePublisher(this.props.item.id))} />
      </li>
    )
  }
}

export default PublisherListItem

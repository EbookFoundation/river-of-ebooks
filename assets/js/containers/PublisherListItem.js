import React from 'react'
import IconButton from '../components/IconButton'
import { removePublisher } from '../actions'
import '../../styles/shared/listitem.scss'

class PublisherListItem extends React.Component {
  constructor () {
    super()
    this.state = {
      revealed: false
    }
    this.toggleReveal = this.toggleReveal.bind(this)
  }
  toggleReveal () {
    this.setState({
      revealed: !this.state.revealed
    })
  }
  render () {
    return (
      <li className='uri-list-item publisher-list-item flex-container'>
        <div className='stack flex site-name flex-container flex-vertical'>
          <span className='label'>Website name</span>
          <span className='value'>{this.props.item.url}</span>
        </div>
        <div className='flex flex-container'>
          <div className='stack flex-container flex-vertical'>
            <span className='label'>AppID</span>
            <input className='value' value={this.props.item.appid} readOnly />
          </div>
          <div className='stack flex flex-container flex-vertical'>
            <span className='label'>Secret</span>
            <input className='value flex' type={this.state.revealed ? 'text' : 'password'} value={this.props.item.secret} readOnly />
          </div>
          <button className='btn btn-clear btn-view' onClick={this.toggleReveal}>{this.state.revealed ? 'Hide' : 'Show'}</button>
        </div>
        <IconButton icon='delete' onClick={() => this.props.dispatch(removePublisher(this.props.item.id))} />
      </li>
    )
  }
}

export default PublisherListItem

import React from 'react'
import ConfirmIconButton from './ConfirmIconButton'
import IconButton from '../components/IconButton'
import Icon from '../components/Icon'
import { removePublisher, setEditingPublisher, saveFile, verifyDomain } from '../actions'
import './listitem.scss'

class PublisherListItem extends React.Component {
  constructor () {
    super()
    this.state = {
      revealed: false
    }
    this.toggleReveal = this.toggleReveal.bind(this)
    this.getView = this.getView.bind(this)
    this.getEditing = this.getEditing.bind(this)
    this.cancelEvent = this.cancelEvent.bind(this)
  }
  toggleReveal (e) {
    e.stopPropagation()
    this.setState({
      revealed: !this.state.revealed
    })
  }
  cancelEvent (e, id) {
    e.stopPropagation()
    if (id === false) return
    this.props.dispatch(setEditingPublisher(id))
  }
  getView () {
    return (
      <li key={this.props.item.appid} className={'uri-list-item publisher-list-item flex-container flex-vertical' + (this.props.item.whitelisted ? ' whitelisted' : '')}>
        <header className='site-name flex-container'>
          <h3 className='flex'>{`${this.props.item.name}${this.props.item.whitelisted ? '' : ' (awaiting approval)'}`}</h3>
          <ConfirmIconButton icon='delete' onClick={() => this.props.dispatch(removePublisher(this.props.item.id))} />
        </header>
        <div className='cols flex flex-container'>
          <div className='col flex flex-container flex-vertical'>
            <div className='stack flex-container flex-vertical'>
              <span className='label'>AppID</span>
              <input className='value' value={this.props.item.appid} readOnly />
            </div>
            <div className='stack flex-container flex-vertical'>
              <span className='label'>Secret</span>
              <div className='flex-container'>
                <input className='value flex' type={this.state.revealed ? 'text' : 'password'} value={this.props.item.secret} readOnly />
                <IconButton className='tiny' onClick={this.toggleReveal} icon={this.state.revealed ? 'eye-close' : 'eye'} />
              </div>
            </div>
          </div>
          <div className='col flex flex-container flex-vertical'>
            <div className='stack flex-container flex-vertical'>
              <span className='label'>Publisher domain</span>
              <input className='value' value={this.props.item.url} readOnly />
            </div>
            <div className='stack flex-container flex-vertical'>
              <span className='label'>Domain verification</span>
              <div className='verification'>
                <Icon icon={this.props.item.verified ? 'shield-check' : 'alert-circle'} className={this.props.item.verified ? 'verified' : 'unverified'} />
                {this.props.item.verified && <span className='verified'>Ownership verified</span>}
                {!this.props.item.verified && <button className='btn btn-clear' onClick={(e) => this.cancelEvent(e, this.props.item.id)}>Verify domain ownership</button>}
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }
  getEditing () {
    return (
      <li key={this.props.item.appid} className='uri-list-item publisher-list-item flex-container flex-vertical editing' onClick={(e) => this.cancelEvent(e, false)}>
        <header className='site-name flex-container'>
          <h3 className='flex'>{this.props.item.name}</h3>
          <ConfirmIconButton icon='delete' onClick={() => this.props.dispatch(removePublisher(this.props.item.id))} />
        </header>
        <div className='cols flex flex-container'>
          <div className='col flex flex-container flex-vertical'>
            <p>
              Download <span className='name'>{this.props.item.verification_key}.html</span> and upload it to the root directory of your webserver. Then, click <strong>VERIFY</strong> to verify that you own and control <span className='name'>{this.props.item.url}</span>.
            </p>
          </div>
          <div className='col flex flex-container flex-vertical'>
            <div className='flex' />
            <button className='btn btn-clear' onClick={() => this.props.dispatch(saveFile(`${this.props.item.verification_key}.html`))}>Download file</button>
            <div className='flex' />
            <div className='flex-container buttons'>
              <span className='cancel flex' onClick={(e) => this.cancelEvent(e, null)}>Cancel</span>
              <button className='flex btn' onClick={(e) => this.props.dispatch(verifyDomain(this.props.item.id))}>Verify</button>
            </div>
          </div>
        </div>
      </li>
    )
  }
  render () {
    return (
      this.props.editing ? this.getEditing() : this.getView()
    )
  }
}

export default PublisherListItem

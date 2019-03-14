'use strict'

import React from 'react'
import ConfirmIconButton from '../containers/ConfirmIconButton'
import UnderlineInput from '../components/UnderlineInput'
import './listitem.scss'
import { changeUrlField, setUrl, removeUrl, setEditingUri } from '../actions'

const uriRegex = /(.+:\/\/)?(.+\.)*(.+\.).{1,}(:\d+)?(.+)?/i
// const isbnRegex = /^(97(8|9))?\d{9}(\d|X)$/

class UriListItem extends React.Component {
  constructor () {
    super()
    this.getView = this.getView.bind(this)
    this.getEditing = this.getEditing.bind(this)
    this.cancelEvent = this.cancelEvent.bind(this)
  }
  cancelEvent (e, id) {
    e.stopPropagation()
    if (id === false) return
    this.props.dispatch(setEditingUri(id))
  }
  getView () {
    return (
      <li className='uri-list-item flex-container' onClick={(e) => this.cancelEvent(e, this.props.item.id)}>
        <div className='stack flex flex-container flex-vertical'>
          <span className='label'>Destination URL</span>
          <span className='value'>{this.props.item.url}</span>
        </div>
        <div className='stack flex flex-container flex-vertical'>
          <span className='label'>Filters</span>
          <span className='value'>{['publisher', 'title', 'author', 'isbn'].reduce((a, x) => a + (this.props.item[x] ? 1 : 0), 0) || 'None'}</span>
        </div>
        <ConfirmIconButton icon='delete' onClick={() => this.props.dispatch(removeUrl(this.props.item.id))} />
      </li>
    )
  }
  getEditing () {
    return (
      <li className='uri-list-item flex-container flex-vertical editing' onClick={(e) => this.cancelEvent(e, false)}>
        <header className='flex-container' onClick={(e) => this.cancelEvent(e, null)}>
          <h3 className='flex'>Editing: {this.props.item.url}</h3>
          <ConfirmIconButton icon='delete' onClick={() => this.props.dispatch(removeUrl(this.props.item.id))} />
        </header>
        <div className='settings'>
          <UnderlineInput
            className='uri flex'
            type='text'
            name={'url-' + this.props.item.id}
            placeholder='Destination URL'
            value={'' + this.props.item.url}
            pattern={uriRegex}
            onChange={(e) => this.props.dispatch(changeUrlField(this.props.item.id, 'url', e.target.value))}
            onBlur={(e) => this.props.dispatch(setUrl(this.props.item))} />
          <h4>Filters</h4>
          <UnderlineInput
            className='uri flex'
            type='text'
            name={'title-' + this.props.id}
            placeholder='Ebook title'
            value={'' + this.props.item.title}
            onChange={(e) => this.props.dispatch(changeUrlField(this.props.item.id, 'title', e.target.value))}
            onBlur={(e) => this.props.dispatch(setUrl(this.props.item))} />
          <UnderlineInput
            className='uri flex'
            type='text'
            name={'author-' + this.props.item.id}
            placeholder='Author'
            value={'' + this.props.item.author}
            onChange={(e) => this.props.dispatch(changeUrlField(this.props.item.id, 'author', e.target.value))}
            onBlur={(e) => this.props.dispatch(setUrl(this.props.item))} />
          <UnderlineInput
            className='uri flex'
            type='text'
            name={'publisher-' + this.props.item.id}
            placeholder='Publisher URL'
            value={'' + this.props.item.publisher}
            onChange={(e) => this.props.dispatch(changeUrlField(this.props.item.id, 'publisher', e.target.value))}
            onBlur={(e) => this.props.dispatch(setUrl(this.props.item))} />
          <UnderlineInput
            className='uri flex'
            type='text'
            name={'isbn-' + this.props.item.id}
            placeholder='Identifier'
            value={'' + this.props.item.isbn}
            onChange={(e) => this.props.dispatch(changeUrlField(this.props.item.id, 'isbn', e.target.value))}
            onBlur={(e) => this.props.dispatch(setUrl(this.props.item))} />
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

export default UriListItem

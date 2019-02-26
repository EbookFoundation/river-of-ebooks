'use strict'

import React from 'react'

import './underlineinput.scss'

const UnderlineInput = props => (
  <div className={'underlined-input ' + (props.className ? props.className : '')}>
    <input
      type={props.type}
      name={props.name}
      value={props.value}
      className={(props.value.length ? 'has-content' : '') + (props.pattern
        ? (props.value.length && !props.pattern.test(props.value) ? ' invalid' : '')
        : '')}
      autoComplete='nothing'
      onChange={props.onChange}
      onBlur={props.onBlur} />
    <div className='reacts-to'>
      <label className='placeholder'>{props.placeholder}</label>
      <div className='underline' />
    </div>
  </div>
)

export default UnderlineInput

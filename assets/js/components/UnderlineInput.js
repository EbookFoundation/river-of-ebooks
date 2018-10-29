import React from 'react'

import STYLE from '../../styles/shared/underlineinput.scss'

const UnderlineInput = props => (
  <div className='underlined-input'>
    <input
      type={props.type}
      name={props.name}
      value={props.value}
      className={(props.value.length ? 'has-content' : '')}
      autoComplete='nothing'
      onChange={props.onChange} />
    <div className='reacts-to'>
      <label className='placeholder'>{props.placeholder}</label>
      <div className='underline' />
    </div>
  </div>
)

export default UnderlineInput

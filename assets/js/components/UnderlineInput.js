import React from 'react'

import STYLE from '../../styles/shared/underlineinput.scss'

const UnderlineInput = props => (
  <div className='underlined-input'>
    <input {...props} placeholder={null} />
    <div className='reacts-to'>
      <label className='placeholder'>{props.placeholder}</label>
      <div className='underline' />
    </div>
  </div>
)

export default UnderlineInput

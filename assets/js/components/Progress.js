'use strict';

import React from 'react';

const Progress = props => (
  <div className={'progress' + (props.bound ? ' bound' : '')}>
    <div className='indeterminate' />
  </div>
)

export default Progress

import React, { useMemo } from 'react';
import Option from './components/Option';

const UI = () => {
  const options = useMemo(() => ['#051266', '#B31A27', '#085908', '#101010', '#7F7F66'], [])
  return (
    <div className="ui">
      <div className="menu">
        {options.map(((opt, index) => <Option key={index} color={opt} />))}
      </div>
    </div>
  )
}

export default UI;

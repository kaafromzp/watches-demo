import React from 'react';
import useStore from '../../../store';

type Props = {
  color: string;
}
const Option = ({ color }: Props) => {
  const mainColor = useStore(state => state.mainColor)
  const setMainColor = useStore(state => state.setMainColor)
  return (
    <div
      onClick={() => { setMainColor(color) }}
      className={mainColor === color ? "active" : ""}
    />
  )
}

export default Option;
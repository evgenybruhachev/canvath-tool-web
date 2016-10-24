import React, { Component } from 'react';
import Icon from '../icon';

import style from './style.scss';

function IconButton ({icon, label, onClick, type = 'button'}){
  console.log(icon);
  return (
    <button className={style.button}
      label={label}
      onClick={onClick}
      type={type}>
      <Icon name={icon} />
      <span className={style.label}>{label}</span>
    </button>
  )
};

IconButton.propTypes = {
  icon: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  type: React.PropTypes.oneOf(['button', 'reset', 'submit'])
};

export default IconButton;
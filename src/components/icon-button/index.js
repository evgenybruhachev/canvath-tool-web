import React, { Component } from 'react';
import classNames from 'classnames';

import style from './style.scss';

function IconButton ({icon, label, onClick, active = false, type = 'button'}){
  return (
    <button className={classNames(style.button, {[style.active]: active})}
      label={label}
      onClick={onClick}
      type={type}>
      <svg className={classNames(style.icon, {[style.active]: active})}>
        <use xlinkHref={`#icon-${icon}`} />
      </svg>
      <span className={classNames(style.label, {[style.active]: active})}>{label}</span>
    </button>
  )
};

IconButton.propTypes = {
  icon: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  active: React.PropTypes.bool,
  type: React.PropTypes.oneOf(['button', 'reset', 'submit'])
};

export default IconButton;
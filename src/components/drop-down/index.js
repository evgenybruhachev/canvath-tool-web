import React, { Component } from 'react';
import classNames from 'classnames';

import style from './style.css';

function DropDown ({label, onSelect}){
  return (
    <div className={style.dropDown} label={label}>
      <span className={style.label}>{label}</span>
      <svg className={style.icon}>
        <use xlinkHref={`#icon-list`} />
      </svg>
    </div>
  )
};

DropDown.propTypes = {
  label: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func
};

export default DropDown;
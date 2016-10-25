import React, { Component } from 'react';
import classNames from 'classnames';

import style from './style.scss';

function Price ({value, onClick}){
  return (
    <button className={style.button}>
      <svg className={style.icon}>
        <use xlinkHref={`#icon-cart`} />
      </svg>
      <span className={style.label}>{value} 円</span>
    </button>
  )
};

Price.propTypes = {
  value: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func
};

export default Price;
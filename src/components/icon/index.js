import React, { Component } from 'react';
import classNames from 'classnames';
import Ink from 'react-ink';

function Icon ({icon, className, style}){
  return (
    <svg className={classNames('icon', className)} style={style}>
      <use xlinkHref={`#icon-${icon}`} />
    </svg>
  )
};

Icon.propTypes = {
  icon: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  style: React.PropTypes.object
};

export default Icon;
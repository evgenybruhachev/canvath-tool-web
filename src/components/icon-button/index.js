import React, { Component } from 'react';
import classNames from 'classnames';
import Ink from 'react-ink';

function IconButton ({icon, label, onClick, active = false, type = 'button', className, style}){
  return (
    <button className={classNames('icon-button', {'active': active}, className)}
      label={label}
      onClick={onClick}
      type={type}
      style={style}>

      <svg className='icon'>
        <use xlinkHref={`#icon-${icon}`} />
      </svg>
      {label && <span className='label'>{label}</span>}
      <Ink hasTouch={false}/>
    </button>
  )
};

IconButton.propTypes = {
  icon: React.PropTypes.string.isRequired,
  label: React.PropTypes.string,
  onClick: React.PropTypes.func,
  active: React.PropTypes.bool,
  type: React.PropTypes.oneOf(['button', 'reset', 'submit']),
  className: React.PropTypes.string,
  style: React.PropTypes.object
};

export default IconButton;
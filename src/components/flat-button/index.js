import React, { Component } from 'react';
import Ink from 'react-ink';

function FlatButton ({icon, label, onClick}){
  return (
    <button className='flat-button'
      label='ESC'
      onClick={onClick}>
      <svg className='icon'>
        <use xlinkHref={`#icon-${icon}`} />
      </svg>
      {label && <span className='label'>{label}</span>}
      <Ink hasTouch={false}/>
    </button>
  )
};

FlatButton.propTypes = {
  icon: React.PropTypes.string.isRequired,
  label: React.PropTypes.string,
  onClick: React.PropTypes.func
};

export default FlatButton;
import React, { Component } from 'react';

function DropDown ({label, onSelect, onClick, style}){
  return (
    <button className='drop-down' label={label} style={style} onClick={onClick}>
      <span className='label'>{label}</span>
      <svg className='icon'>
        <use xlinkHref={`#icon-list`} />
      </svg>
    </button>
  )
};

DropDown.propTypes = {
  label: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func,
  onClick: React.PropTypes.func,
  style: React.PropTypes.object,
};

export default DropDown;
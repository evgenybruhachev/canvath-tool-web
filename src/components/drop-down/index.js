import React, { Component } from 'react';

function DropDown ({label, onSelect}){
  return (
    <div className='drop-down' label={label}>
      <span className='label'>{label}</span>
      <svg className='icon'>
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
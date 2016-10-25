import React, { Component } from 'react';
import Ink from 'react-ink';

function CartButton ({value, onClick}){
  return (
    <button className='cart-button'>
      <Ink hasTouch={false}/>
      <svg className='icon'>
        <use xlinkHref={`#icon-cart`} />
      </svg>
      <span className='label'>{value} 円</span>
    </button>
  )
};

CartButton.propTypes = {
  value: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func
};

export default CartButton;
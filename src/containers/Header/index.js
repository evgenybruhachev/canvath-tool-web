import React, { Component } from 'react';

import IconButton from '../../components/icon-button';
import DropDown from '../../components/drop-down';
import Price from '../../components/cart-button';

class Header extends Component{

  render(){
    return (
      <div className='app-header'>
        <img src="assets/logo.png" alt="Nobori" className='logo'/>
        <IconButton icon="poster" label='開く' />
        <IconButton icon="save" label='開く' />
        <DropDown label='Type' />
        <DropDown label='Side' />
        <DropDown label='Color' />
        <Price value='5000' />
      </div>
    )
  }

}

export default Header;
import React, { Component } from 'react';

import IconButton from '../../components/icon-button';
import Price from '../../components/cart-button';

class HeaderMobile extends Component{

  render(){
    return (
      <div className='app-header'>
        <IconButton icon="hamburger" className="blue" style={{padding: 15 + 'px'}}/>
        <IconButton icon="zoom-in" label='Zoom In' className="blue"/>
        <IconButton icon="zoom-out" label='Zoom Out' className="blue"/>
        <IconButton icon="undo" label='Undo' className="blue"/>
        <IconButton icon="redo" label='Redo' className="blue"/>
        <Price value={'5000'} />
      </div>
    )
  }

}

export default HeaderMobile;
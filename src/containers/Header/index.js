import React, { Component } from 'react';

import IconButton from '../../components/icon-button';

import style from './style.scss';

class Header extends Component{

  render(){
    return (
      <div className={style.header}>
        <img src="assets/logo.png" alt="Nobori" className={style.logo}/>
        <IconButton icon="poster" label={'開く'} />
      </div>
    )
  }

}

export default Header;
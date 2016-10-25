import React, { Component } from 'react';

import IconButton from '../../components/icon-button';

import style from './style.scss';

class Toolbar extends Component{

  render(){
    return (
      <div className={style.toolbar}>
        <IconButton icon="zoom-in" label={'Zoom In'} />
        <IconButton icon="zoom-out" label={'Zoom Out'} />
        <IconButton icon="undo" label={'Undo'} />
        <IconButton icon="redo" label={'Redo'} />
        <IconButton icon="hand" label={'Panning'} />
        <IconButton icon="cursor" label={'移動'} active={true}/>
        <IconButton icon="cancel" label={'削除'} />
        <IconButton icon="brush" label={'筆'} />
        <IconButton icon="text" label={'テキスト'} />
        <IconButton icon="image" label={'画像'} />
        <IconButton icon="sticker" label={'スタンプ'} />
        <IconButton icon="figures" label={'シェイプ'} />
        <IconButton icon="opacity" label={'カラー削除'} />
        <IconButton icon="layers" label={'レイヤ'} />
      </div>
    )
  }

}

export default Toolbar;
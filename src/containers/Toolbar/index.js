import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';

import IconButton from '../../components/icon-button';

import * as DrawToolActions from '../../actions/draw-tool';

class Toolbar extends Component{

  _toggleActiveTool(tool){
    this.props.actions.set_active_tool(tool);
  }

  render(){

    const active_tool = this.props.active_tool;

    return (
      <div className='toolbar'>

        <MediaQuery query='(min-width: 769px)'>
          <IconButton icon="zoom-in" label={'Zoom In'} />
          <IconButton icon="zoom-out" label={'Zoom Out'} />
          <IconButton icon="undo" label={'Undo'} />
          <IconButton icon="redo" label={'Redo'} />
          <IconButton icon="trash" label={'削除'} onClick={this._toggleActiveTool.bind(this, 'eraser')} active={active_tool === 'eraser'}/>
          <div className="separator"></div>
        </MediaQuery>
        <IconButton icon="hand" label={'Panning'} onClick={this._toggleActiveTool.bind(this, 'panning')} active={active_tool === 'panning'}/>
        <IconButton icon="cursor" label={'移動'} onClick={this._toggleActiveTool.bind(this, 'pointer')} active={active_tool === 'pointer'}/>
        <IconButton icon="brush" label={'筆'} onClick={this._toggleActiveTool.bind(this, 'brush')} active={active_tool === 'brush'}/>
        <IconButton icon="text" label={'テキスト'} onClick={this._toggleActiveTool.bind(this, 'text')} active={active_tool === 'text'}/>
        <IconButton icon="image" label={'画像'} onClick={this._toggleActiveTool.bind(this, 'image')} active={active_tool === 'image'}/>
        <IconButton icon="sticker" label={'スタンプ'} onClick={this._toggleActiveTool.bind(this, 'sticker')} active={active_tool === 'sticker'}/>
        <IconButton icon="figures" label={'シェイプ'} onClick={this._toggleActiveTool.bind(this, 'svg')} active={active_tool === 'svg'}/>
        <IconButton icon="opacity" label={'カラー削除'} onClick={this._toggleActiveTool.bind(this, 'removeColor')} active={active_tool === 'removeColor'}/>
        <IconButton icon="layers" label={'レイヤ'} onClick={this._toggleActiveTool.bind(this, 'layers')} active={active_tool === 'layers'}/>
      </div>
    )
  }

}


function mapStateToProps(state) {
  return {
    active_tool: state.drawTool.active_tool
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(DrawToolActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);


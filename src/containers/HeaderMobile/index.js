import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as DrawToolActions from '../../actions/draw-tool';

import IconButton from '../../components/icon-button';
import Price from '../../components/cart-button';


class HeaderMobile extends Component{

  _toggleActiveTool(tool){
    this.props.actions.set_active_tool(tool);
  }

  render(){

    const active_tool = this.props.active_tool;

    return (
      <div className='app-header'>
        <IconButton icon="hamburger" className="blue" style={{padding: 15 + 'px'}}/>
        <IconButton icon="zoom-in" label='Zoom In' className="blue"/>
        <IconButton icon="zoom-out" label='Zoom Out' className="blue"/>
        <IconButton icon="undo" label='Undo' className="blue"/>
        <IconButton icon="redo" label='Redo' className="blue"/>
        <IconButton icon="cancel" label={'削除'} className="blue" onClick={this._toggleActiveTool.bind(this, 'eraser')}
                    active={active_tool === 'eraser'}/>
        <IconButton icon="trash" label='全削除' className="blue"/>
        <Price value={'5000'} />
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
)(HeaderMobile);


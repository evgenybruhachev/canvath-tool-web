import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Scrollbars } from 'react-custom-scrollbars';

import Button from '../../components/button';

import * as DrawToolActions from '../../actions/draw-tool';

class Toolbar extends Component {

  static propTypes = {
    actions: React.PropTypes.obj,
    activeTool: React.PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = {
      mobile: false,
    };

    this.toggleActiveTool = this.toggleActiveTool.bind(this);
    this.getIsMobile = this.getIsMobile.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.getIsMobile, false);
    this.getIsMobile();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.getIsMobile, false);
  }

  getIsMobile() {
    this.setState(state => Object.assign(state,
      { mobile: window.matchMedia('(max-width: 768px)').matches,
        height: window.innerHeight,
      }));
  }

  toggleActiveTool(tool) {
    this.props.actions.setActiveTool(tool);
  }

  render() {
    const { activeTool } = this.props;

    let view;

    if (this.state.mobile) {
      view = (
        <div className="toolbar">
          <Button icon="hand" label={'Panning'} onClick={() => this.toggleActiveTool('panning')} active={activeTool === 'panning'} />
          <Button icon="cursor" label={'移動'} onClick={() => this.toggleActiveTool('pointer')} active={activeTool === 'pointer'} />
          <Button icon="brush" label={'筆'} onClick={() => this.toggleActiveTool('brush')} active={activeTool === 'brush'} />
          <Button icon="text" label={'テキスト'} onClick={() => this.toggleActiveTool('text')} active={activeTool === 'text'} />
          <Button icon="image" label={'画像'} onClick={() => this.toggleActiveTool('image')} active={activeTool === 'image'} />
          <Button icon="sticker" label={'スタンプ'} onClick={() => this.toggleActiveTool('sticker')} active={activeTool === 'sticker'} />
          <Button icon="figures" label={'シェイプ'} onClick={() => this.toggleActiveTool('shapes')} active={activeTool === 'shapes'} />
          <Button icon="opacity" label={'カラー削除'} onClick={() => this.toggleActiveTool('removeColor')} active={activeTool === 'removeColor'} />
          <Button icon="layers" label={'レイヤ'} onClick={() => this.toggleActiveTool('layers')} active={activeTool === 'layers'} />
        </div>
      );
    } else {
      view = (
        <Scrollbars
          style={{ width: 60 }}
          autoHide
          hideTracksWhenNotNeeded
          autoHeight
          autoHeightMax={this.state.height - 60}
        >
          <div className="toolbar">
            <Button icon="zoom-in" label={'Zoom In'} />
            <Button icon="zoom-out" label={'Zoom Out'} />
            <Button icon="undo" label={'Undo'} />
            <Button icon="redo" label={'Redo'} />
            <Button icon="trash" label={'削除'} onClick={() => this.toggleActiveTool('eraser')} active={activeTool === 'eraser'} />
            <div className="separator" />
            <Button icon="hand" label={'Panning'} onClick={() => this.toggleActiveTool('panning')} active={activeTool === 'panning'} />
            <Button icon="cursor" label={'移動'} onClick={() => this.toggleActiveTool('pointer')} active={activeTool === 'pointer'} />
            <Button icon="brush" label={'筆'} onClick={() => this.toggleActiveTool('brush')} active={activeTool === 'brush'} />
            <Button icon="text" label={'テキスト'} onClick={() => this.toggleActiveTool('text')} active={activeTool === 'text'} />
            <Button icon="image" label={'画像'} onClick={() => this.toggleActiveTool('image')} active={activeTool === 'image'} />
            <Button icon="sticker" label={'スタンプ'} onClick={() => this.toggleActiveTool('sticker')} active={activeTool === 'sticker'} />
            <Button icon="figures" label={'シェイプ'} onClick={() => this.toggleActiveTool('shapes')} active={activeTool === 'shapes'} />
            <Button icon="opacity" label={'カラー削除'} onClick={() => this.toggleActiveTool('removeColor')} active={activeTool === 'removeColor'} />
            <Button icon="layers" label={'レイヤ'} onClick={() => this.toggleActiveTool('layers')} active={activeTool === 'layers'} />
          </div>
        </Scrollbars>
      );
    }

    return view;
  }

}


function mapStateToProps(state) {
  return {
    activeTool: state.drawTool.activeTool,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(DrawToolActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);

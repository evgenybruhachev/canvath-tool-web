import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

import Button from '../../components/button';
import Upload from '../../components/upload';

import { upload } from '../../api/extras';

import * as actions from '../../actions/draw-tool';

class Toolbar extends Component {

  static propTypes = {
    activeTool: React.PropTypes.string,
    activeSide: React.PropTypes.object,
    dispatch: React.PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      mobile: false,
      height: 600,
    };

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

  fileUpload(files) {
    const { dispatch } = this.props;

    upload(files).then(data => dispatch(actions.insertImage(data)));
  }

  render() {
    const { activeTool, dispatch } = this.props;

    let view;

    if (this.state.mobile) {
      view = (
        <div className="toolbar">
          <Button icon="hand" label={'Panning'} onClick={() => dispatch(actions.setActiveTool('panning'))} active={activeTool === 'panning'} />
          <Button icon="cursor" label={'移動'} onClick={() => dispatch(actions.setActiveTool('pointer'))} active={activeTool === 'pointer'} />
          <Button icon="brush" label={'筆'} onClick={() => dispatch(actions.setActiveTool('brush'))} active={activeTool === 'brush'} />
          <Button icon="text" label={'テキスト'} onClick={() => dispatch(actions.setActiveTool('text'))} active={activeTool === 'text'} />
          <Button icon="image" label={'画像'} onClick={() => dispatch(actions.setActiveTool('image'))} active={activeTool === 'image'} />
          <Button icon="sticker" label={'スタンプ'} onClick={() => dispatch(actions.setActiveTool('sticker'))} active={activeTool === 'sticker'} />
          <Button icon="figures" label={'シェイプ'} onClick={() => dispatch(actions.setActiveTool('shapes'))} active={activeTool === 'shapes'} />
          <Button icon="opacity" label={'カラー削除'} onClick={() => dispatch(actions.setActiveTool('removeColor'))} active={activeTool === 'removeColor'} />
          <Button icon="layers" label={'レイヤ'} onClick={() => dispatch(actions.setActiveTool('layers'))} active={activeTool === 'layers'} />
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
            <Button icon="zoom-in" label={'Zoom In'} onClick={() => dispatch(actions.zoomIn())} />
            <Button icon="zoom-out" label={'Zoom Out'} onClick={() => dispatch(actions.zoomOut())} />
            <Button icon="undo" label={'Undo'} disabled={activeTool === 'brush'} onClick={() => dispatch(actions.undo())} />
            <Button icon="redo" label={'Redo'} disabled={activeTool === 'brush'} onClick={() => dispatch(actions.redo())} />
            <Button icon="trash" label={'削除'} onClick={() => dispatch(actions.remove())} />
            <div className="separator" />
            <Button icon="hand" label={'Panning'} onClick={() => dispatch(actions.setActiveTool('panning'))} active={activeTool === 'panning'} />
            <Button icon="cursor" label={'移動'} onClick={() => dispatch(actions.setActiveTool('pointer'))} active={activeTool === 'pointer'} />
            <Button icon="brush" label={'筆'} onClick={() => dispatch(actions.setActiveTool('brush'))} active={activeTool === 'brush'} />
            <Button icon="text" label={'テキスト'} onClick={() => dispatch(actions.setActiveTool('text'))} active={activeTool === 'text'} />
            <Upload icon="image" label={'画像'} onUpload={files => this.fileUpload(files)} />
            <Button icon="sticker" label={'スタンプ'} onClick={() => dispatch(actions.setActiveTool('sticker'))} active={activeTool === 'sticker'} />
            <Button icon="figures" label={'シェイプ'} onClick={() => dispatch(actions.setActiveTool('shapes'))} active={activeTool === 'shapes'} />
            <Button icon="opacity" label={'カラー削除'} onClick={() => dispatch(actions.setActiveTool('removeColor'))} active={activeTool === 'removeColor'} />
            <Button icon="layers" label={'レイヤ'} onClick={() => dispatch(actions.setActiveTool('layers'))} active={activeTool === 'layers'} />
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
    activeTool: state.drawTool.activeTool,
    activeSide: state.product.sideSelected,
  };
}

export default connect(
  mapStateToProps
)(Toolbar);

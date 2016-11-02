import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/button';
import DropDownM from '../../components/drop-down-material';
import ColorPicker from '../../components/color-picker';
import Layer from '../../components/layer';
import Icon from '../../components/icon';

import * as actions from '../../actions/draw-tool';

class Options extends Component {

  static propTypes = {
    activeTool: React.PropTypes.string,
    availableBrushes: React.PropTypes.array,
    availableFonts: React.PropTypes.array,
    activeBrush: React.PropTypes.string,
    brushOptions: React.PropTypes.object,
    textOptions: React.PropTypes.object,
    dispatch: React.PropTypes.func,
  }

  // constructor(props) {
  //   super(props);
  // }


  render() {
    const {
      activeTool,
      availableBrushes,
      availableFonts,
      activeBrush,
      textOptions,
      brushOptions,
      dispatch
    } = this.props;

    let content;

    const shape = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Linecons_heart-shape.svg/2000px-Linecons_heart-shape.svg.png';

    switch (activeTool) {
      case 'pointer':
        content = (
          <div className="options">
            <div className="top">
              <Button icon={'align-top'} label={'Top'} />
              <Button icon={'align-ver-center'} label={'Vertical Center'} />
              <Button icon={'align-bottom'} label={'Bottom'} />
              <Button icon={'align-left'} label={'Left'} />
              <Button icon={'align-hor-center'} label={'Horizontal Center'} />
              <Button icon={'align-right'} label={'Right'} />
            </div>
          </div>
        );
        break;
      case 'brush':
        content = (
          <div className="options">
            <div className="top">
              <DropDownM
                className="icons"
                value={activeBrush}
                onChange={brush => dispatch(actions.selectBrush(brush))}
                elements={availableBrushes
                  .map(brush => ({ val: brush, node: <Icon icon={brush} /> }))
                }
              />
              <ColorPicker
                color={brushOptions.color}
                onChange={color => dispatch(actions.selectBrushColor(color))}
              />
              <DropDownM
                label="Size"
                value={brushOptions.width.toString()}
                elements={Array(100).fill(null)
                  .map((i, index) => ({ val: String(index + 1), node: <span>{index + 1}px</span> })
                )}
                onChange={size => dispatch(actions.selectBrushSize(size))}
              />
              <DropDownM
                label="Opacity"
                value={brushOptions.opacity.toString()}
                elements={Array(10).fill(null).map(
                  (i, index) => ({ val: String((index + 1) / 10),
                    node: <span>{(index + 1) * 10}%</span> })
                )}
                onChange={value => dispatch(actions.selectBrushOpacity(value))}
              />
            </div>
          </div>
        );
        break;
      case 'text':
        content = (
          <div className="options">
            <div className="top">

              <Button
                label={'Add Text'}
                onClick={() => dispatch(actions.addText())}
                className="add-text"
              />

              <ColorPicker
                color={textOptions.color}
                onChange={color => dispatch(actions.selectTextColor(color))}
              />

              <DropDownM
                label="Font"
                value={textOptions.font}
                elements={availableFonts.map(font => ({ val: font,
                  node: <span style={{ fontFamily: font }}>{font}</span> }))}
                onChange={font => dispatch(actions.selectTextFont(font))}
              />

              <DropDownM
                label="Size"
                value={textOptions.size.toString()}
                elements={[6, 8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72]
                  .map(size => ({ val: size.toString(), node: <span>{size}</span> }))}
                onChange={size => dispatch(actions.selectTextSize(size))}
              />

              <Button
                icon={'text-align-justify'}
                label={'Justify'}
                onClick={() => dispatch(actions.selectTextAlign('justify'))}
                active={textOptions.align === 'justify'}
              />
              <Button
                icon={'text-align-left'}
                label={'Left'}
                onClick={() => dispatch(actions.selectTextAlign('left'))}
                active={textOptions.align === 'left'}
              />
              <Button
                icon={'text-align-center'}
                label={'Center'}
                onClick={() => dispatch(actions.selectTextAlign('center'))}
                active={textOptions.align === 'center'}
              />
              <Button
                icon={'text-align-right'}
                label={'Right'}
                onClick={() => dispatch(actions.selectTextAlign('right'))}
                active={textOptions.align === 'right'}
              />

              <Button
                icon={'text-bold'}
                label={'Bold'}
                onClick={() => dispatch(actions.selectTextBold(!textOptions.bold))}
                active={textOptions.bold}
              />
              <Button
                icon={'text-italic'}
                label={'Italic'}
                onClick={() => dispatch(actions.selectTextItalic(!textOptions.italic))}
                active={textOptions.italic}
              />
              {/* <Button icon={'text-underline'} label={'Underline'} /> */}
            </div>
          </div>
        );
        break;
      case 'sticker':
        content = (
          <div className="options">
            <div className="top">
              <Button image={'https://vk.com/images/stickers/3375/512.png'} label={'persik'} />
              <Button image={'https://vk.com/images/stickers/3375/512.png'} label={'persik'} />
              <Button image={'https://vk.com/images/stickers/3375/512.png'} label={'persik'} />
            </div>
            <div className="bottom">
              <Layer path="https://vk.com/images/stickers/3375/512.png" />
              <Layer path="https://vk.com/images/stickers/3375/512.png" />
              <Layer path="https://vk.com/images/stickers/3375/512.png" />
              <Layer path="https://vk.com/images/stickers/3375/512.png" />
            </div>
          </div>
        );
        break;
      case 'shapes':
        content = (
          <div className="options">
            <div className="top">
              <ColorPicker color="#ffaaff" />
              <img src={shape} style={{ width: '45px', height: '45px', display: 'block', margin: '0 10px' }} alt="" />
              <img src={shape} style={{ width: '45px', height: '45px', display: 'block', margin: '0 10px' }} alt="" />
              <img src={shape} style={{ width: '45px', height: '45px', display: 'block', margin: '0 10px' }} alt="" />
              <img src={shape} style={{ width: '45px', height: '45px', display: 'block', margin: '0 10px' }} alt="" />
            </div>
          </div>
        );
        break;
      case 'removeColor':
        content = (
          <div className="options">
            <div className="top">
              <ColorPicker color="#ffaaff" />
              <Button icon={'pipette'} label={'Pipette'} />
              <Button icon={'close'} label={'Delete color'} />
            </div>
          </div>
        );
        break;
      case 'layers':
        content = (
          <div className="options">
            <div className="top">
              <Button icon={'align-top'} label={'Top'} />
              <Button icon={'align-ver-center'} label={'Vertical Center'} />
              <Button icon={'align-bottom'} label={'Bottom'} />
              <Button icon={'align-left'} label={'Left'} />
              <Button icon={'align-hor-center'} label={'Horizontal Center'} />
              <Button icon={'align-right'} label={'Right'} />
            </div>
            <div className="bottom">
              <Layer path="https://vk.com/images/stickers/3375/512.png" />
              <Layer path="https://vk.com/images/stickers/3375/512.png" />
              <Layer path="https://vk.com/images/stickers/3375/512.png" />
              <Layer path="https://vk.com/images/stickers/3375/512.png" />
            </div>
          </div>
        );
        break;
      default:
        content = (null);
    }

    return content;
  }

}


function mapStateToProps(state) {
  return {
    activeTool: state.drawTool.activeTool,
    activeBrush: state.drawTool.activeBrush,
    brushOptions: state.drawTool.brushOptions,
    textOptions: state.drawTool.textOptions,
    availableBrushes: state.drawTool.availableBrushes,
    availableFonts: state.drawTool.availableFonts,
  };
}

export default connect(
  mapStateToProps
)(Options);

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '../../components/button';
import DropDownM from '../../components/drop-down-material';
import ColorPicker from '../../components/color-picker';
import Layer from '../../components/layer';

import * as DrawToolActions from '../../actions/draw-tool';

class Options extends Component {

  static propTypes = {
    activeTool: React.PropTypes.string,
  }

  // constructor(props) {
  //   super(props);
  // }


  render() {
    const activeTool = this.props.activeTool;

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
              <ColorPicker color="#ffaaff" />
              <DropDownM
                label="Size"
                value="28px"
                elements={
                  [{
                    val: '12px',
                    node: <span>12px</span>,
                  },
                  {
                    val: '28px',
                    node: <span>28px</span>,
                  }]
                }
              />
              <DropDownM
                label="Opacity"
                value="100%"
                elements={
                  [{
                    val: '50%',
                    node: <span>50%</span>,
                  },
                  {
                    val: '25%',
                    node: <span>25%</span>,
                  }]
                }
              />
            </div>
          </div>
        );
        break;
      case 'text':
        content = (
          <div className="options">
            <div className="top">
              <ColorPicker color="#ffaaff" />

              <DropDownM
                label="Font"
                value="Arial"
                elements={
                  [{
                    val: 'Arial',
                    node: <span>Arial</span>,
                  },
                  {
                    val: 'Helvetica',
                    node: <span>Helvetica</span>,
                  }]
                }
              />

              <DropDownM
                label="Size"
                value="14px"
                elements={
                  [{
                    val: '14px',
                    node: <span>14px</span>,
                  },
                  {
                    val: '18px',
                    node: <span>18px</span>,
                  }]
                }
              />

              <Button icon={'text-align-justify'} label={'Justify'} />
              <Button icon={'text-align-left'} label={'Left'} />
              <Button icon={'text-align-center'} label={'Center'} />
              <Button icon={'text-align-right'} label={'Right'} />

              <Button icon={'text-bold'} label={'Bold'} />
              <Button icon={'text-italic'} label={'Italic'} />
              <Button icon={'text-underline'} label={'Underline'} />
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
)(Options);

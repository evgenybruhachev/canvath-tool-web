import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '../../components/button';
import DropDown from '../../components/drop-down';

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

    switch (activeTool) {
      case 'pointer':
        content = (
          <div className="options">
            <Button icon={'align-top'} label={'Top'} />
            <Button icon={'align-ver-center'} label={'Vertical Center'} />
            <Button icon={'align-bottom'} label={'Bottom'} />
            <Button icon={'align-left'} label={'Left'} />
            <Button icon={'align-hor-center'} label={'Horizontal Center'} />
            <Button icon={'align-right'} label={'Right'} />
          </div>
        );
        break;
      case 'brush':
        content = (
          <div className="options">
            <Button icon={'align-top'} label={'Top'} />
            <Button icon={'align-ver-center'} label={'Vertical Center'} />
            <Button icon={'align-bottom'} label={'Bottom'} />
            <Button icon={'align-left'} label={'Left'} />
            <Button icon={'align-hor-center'} label={'Horizontal Center'} />
            <Button icon={'align-right'} label={'Right'} />
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

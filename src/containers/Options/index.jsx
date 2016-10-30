import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import IconButton from '../../components/icon-button';

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

    if (activeTool === 'pointer') {
      content = (
        <div className="options">
          <IconButton icon={'align-top'} label={'Top'} />
          <IconButton icon={'align-ver-center'} label={'Vertical Center'} />
          <IconButton icon={'align-bottom'} label={'Bottom'} />
          <IconButton icon={'align-left'} label={'Left'} />
          <IconButton icon={'align-hor-center'} label={'Horizontal Center'} />
          <IconButton icon={'align-right'} label={'Right'} />
        </div>
      );
    } else {
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

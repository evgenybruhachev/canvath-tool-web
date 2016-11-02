import React, { Component } from 'react';

import DrawTool from '../../draw-tool/drawtool';

class DrawToolComponent extends Component {

  componentDidMount() {
    DrawTool.initialize(this.node, {});
  }

  render() {
    return (
      <div className="draw-tool" ref={(node) => { this.node = node; return node; }} />
    );
  }

}

export default DrawToolComponent;

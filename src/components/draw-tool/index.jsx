import React, { Component } from 'react';

import DrawTool from '../../draw-tool/drawtool';
import escapeJSON from '../../utils/escapeJSON';

class DrawToolComponent extends Component {

  static propTypes = {
    colors: React.PropTypes.array,
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const colors = this.props.colors;

    DrawTool.initialize(this.node, {});

    colors[0].sides.map((side) => {
      let sideProps = JSON.parse(JSON.parse(escapeJSON(side.ProductColorSide.content)));
      let fSide = DrawTool.sides.addSide(sideProps.id);
      fSide.setImage(sideProps.imageUrl, sideProps.size)
        .then(() => {
          fSide.setBorder(sideProps.border);
          fSide.FabricCanvas.renderAll.bind(fSide.FabricCanvas);
        });
    });
    DrawTool.sides.select(colors[0].sides[0].ProductColorSide.title.toLowerCase());
  }

  render() {
    return (
      <div className="draw-tool" ref={(node) => { this.node = node; return node; }} />
    );
  }

}

export default DrawToolComponent;

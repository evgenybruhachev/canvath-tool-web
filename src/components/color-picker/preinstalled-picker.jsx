import React from 'react';
import { CirclePicker } from 'react-color';

import DrawTool from '../../draw-tool/drawtool';


class PreinstalledPicker extends React.Component {
    constructor(props) {
        super(props);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.state = {
          colors: DrawTool.colors,
          circleSize: 36,
          circleSpacing: 23,
          width: 354
        };

    };
    handleColorChange (e) {
        this.props.updateColor(e.rgb);
    };

    componentDidMount() {
      $('.preinstalled-wrap span div div').click(function() {
          $('.tab-content-custom span div div').removeClass('activeColor');
          $(this).addClass('activeColor');
      });
    }
    render() {
        return <CirclePicker
            colors = {this.state.colors}
            circleSize = {this.state.circleSize}
            circleSpacing = {this.state.circleSpacing}
            width = {this.state.width}
            onChangeComplete={ this.handleColorChange }
        />;
    }
}
export default PreinstalledPicker;

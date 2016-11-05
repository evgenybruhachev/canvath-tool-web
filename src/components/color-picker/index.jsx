import React, { Component } from 'react';
import { SketchPicker } from 'react-color';

class ColorPicker extends Component {

  static propTypes = {
    color: React.PropTypes.string,
    onChange: React.PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      displayColorPicker: false,
      color: props.color || 'rgba(0,162,255,1)',
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({ color: props.color });
  }
  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  handleClose() {
    this.setState({ displayColorPicker: false });
  }

  handleChangeComplete(color) {
    const rgb = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a || 1})`;
    this.setState({ color: rgb });
    if (this.props.onChange) {
      this.props.onChange(rgb);
    }
  }

  render() {
    return (
      <div className="color-picker">
        <div className="swatch" onClick={this.handleClick}>
          <div className="color" style={{ backgroundColor: this.state.color }} />
        </div>
        { this.state.displayColorPicker ? <div className="popover">
          <div className="cover" onClick={this.handleClose} />
          <SketchPicker presetColors={[]} color={this.state.color} onChangeComplete={this.handleChangeComplete} />
        </div> : null }

      </div>
    );
  }
}

export default ColorPicker;

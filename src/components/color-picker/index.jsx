import React, { Component } from 'react';
import { SketchPicker } from 'react-color';

class ColorPicker extends Component {

  static propTypes = {
    color: React.PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = {
      displayColorPicker: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  handleClose() {
    this.setState({ displayColorPicker: false });
  }

  handleChange(color) {
    this.setState({ color: color.hex });
  }

  render() {
    const { color } = this.props;

    return (
      <div className="color-picker">
        <div className="swatch" onClick={this.handleClick}>
          <div className="color" style={{ backgroundColor: (this.state.color || color) }} />
        </div>
        { this.state.displayColorPicker ? <div className="popover">
          <div className="cover" onClick={this.handleClose} />
          <SketchPicker color={this.state.color || color} onChange={this.handleChange} />
        </div> : null }

      </div>
    );
  }
}

export default ColorPicker;

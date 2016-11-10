import React, { Component } from 'react';
import classNames from 'classnames';
import Ink from 'react-ink';
import Dropzone from 'react-dropzone';

import Icon from '../icon';

class IconButton extends Component {

  static propTypes = {
    label: React.PropTypes.string,
    icon: React.PropTypes.string,
    image: React.PropTypes.string,
    type: React.PropTypes.oneOf(['button', 'reset', 'submit']),
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    disabled: React.PropTypes.bool,
    onUpload: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};

    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    this.props.onUpload(files);
  }

  render() {
    const {
      label,
      icon,
      image,
      disabled,
      type = 'button',
      className,
      style,
    } = this.props;

    return (
      <div
        className={classNames('button', { disabled }, className)}
        label={label}
        type={type}
        style={style}
      >
        {/* <Ink hasTouch={false} /> */}
        <Dropzone
          multiple={false}
          onDrop={this.onDrop}
          ref={(node) => { this.dropzone = node; return node; }}
          style={{ borderWidth: 0 }}
        >
          {image && <img className="image" src={image} alt="" />}
          {icon && <Icon icon={icon} />}
          {label && <span className="label">{label}</span>}
        </Dropzone>
      </div>
    );
  }
}

export default IconButton;

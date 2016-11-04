import React, { Component } from 'react';
import classNames from 'classnames';

class Layer extends Component {

  static propTypes = {
    path: React.PropTypes.string,
    uuid: React.PropTypes.string,
    onBlur: React.PropTypes.func,
    onFocus: React.PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { onFocus, onBlur, uuid } = this.props;

    this.setState((state) => {
      if (state.active) {
        onBlur(uuid);
      } else {
        onFocus(uuid);
      }
      return Object.assign(state, { active: !this.state.active });
    });
  }

  render() {
    const { path, uuid } = this.props;

    return (
      <div
        className={classNames('layer', { active: this.state.active })}
        onClick={this.toggle}
        data-uuid={uuid}
        style={{ backgroundImage: `url(${path})` }}
      />
    );
  }
}

export default Layer;

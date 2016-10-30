import React, { Component } from 'react';
import classNames from 'classnames';

class Layer extends Component {

  static propTypes = {
    path: React.PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(state => Object.assign(state, { active: !this.state.active }));
  }

  render() {
    const { path } = this.props;

    return (
      <img
        src={path}
        alt=""
        className={classNames('layer', { active: this.state.active })}
        onClick={this.toggle}
      />
    );
  }
}

export default Layer;

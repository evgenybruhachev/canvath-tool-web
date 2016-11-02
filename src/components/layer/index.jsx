import React, { Component } from 'react';
import classNames from 'classnames';

class Layer extends Component {

  static propTypes = {
    path: React.PropTypes.string,
    uuid: React.PropTypes.string,
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

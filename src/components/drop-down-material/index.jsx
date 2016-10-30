import React, { Component } from 'react';
import classNames from 'classnames';

class DropDownMaterial extends Component {

  static propTypes = {
    label: React.PropTypes.string,
    style: React.PropTypes.obj,
    className: React.PropTypes.string,
    onClick: React.PropTypes.func,
    elements: React.PropTypes.obj,
  }

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      selected: {},
    };

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.openList = this.openList.bind(this);
    this.select = this.select.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside(e) {
    if (!this.node.contains(e.target)) {
      this.setState(state => Object.assign(state, { active: false }));
    }
  }

  openList(e) {
    if (e.target.classList.contains('drop-down_head')) {
      this.setState(state => Object.assign(state, { active: !this.state.active }));
    }
  }

  select(val) {
    this.setState(state => Object.assign(state, { label: val, active: false }));
  }

  render() {
    const { label, style, onClick, elements, className } = this.props;

    return (
      <button
        className={classNames('drop-down-material', { active: this.state.active }, className)} label={label}
        style={style}
        onClick={onClick || this.openList}
        ref={(node) => { this.node = node; return node; }}
      >
        <div className="drop-down_head">
          <span className="label">{this.state.label || label}</span>
        </div>
        <div className="list">
          {
            elements.map((el, val) => React.cloneElement(el,
              { onClick: () => this.select(el, val) }
            ))
          }
        </div>
      </button>
    );
  }
}

export default DropDownMaterial;

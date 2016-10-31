import React, { Component } from 'react';
import classNames from 'classnames';

class DropDownMaterial extends Component {

  static propTypes = {
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    className: React.PropTypes.string,
    elements: React.PropTypes.arr,
  }

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      value: null,
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

  select(val, node) {
    this.setState(state => Object.assign(state, { value: node, active: false }));
  }

  render() {
    const { label, value, elements, className } = this.props;

    return (
      <button
        className={classNames('drop-down-material', { active: this.state.active }, className)}
        value={value}
        onClick={this.openList}
        ref={(node) => { this.node = node; return node; }}
      >
        <div className="drop-down_head">
          {label && <div className="label">{label}</div>}
          <div className="value">
            {this.state.value || elements[0].node}<div className="arrow" />
          </div>
        </div>
        <div className="list">
          {
            elements.map((el, key) => React.cloneElement(el.node,
              { onClick: () => this.select(el.val, el.node), key: key.toString(), className: 'list-item' }
            ))
          }
        </div>
      </button>
    );
  }
}

export default DropDownMaterial;

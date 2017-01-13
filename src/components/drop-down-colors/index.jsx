import React, { Component } from 'react';
import classNames from 'classnames';
import Icon from '../icon';


class DropDownColor extends Component {

  static propTypes = {
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
    ]),
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    onClick: React.PropTypes.func,
    children: React.PropTypes.array,
    onChange: React.PropTypes.func,
    selected: React.PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      label: null,
    };

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.openList = this.openList.bind(this);
    this.select = this.select.bind(this);
    this.close = this.close.bind(this);
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

  select(val, meta) {
    this.setState(state => Object.assign(state, { label: val, active: false }));
    if (this.props.onChange) this.props.onChange(meta || val);
  }

  close(){
    this.setState(state => Object.assign(state, { active: false }));
  }

  render() {
    const { label, style, onClick, children, className, selected } = this.props;

    return (
      <div
        className={classNames('drop-down-colors', { active: this.state.active }, className)} label={label}
        style={style}
        onClick={onClick || this.openList}
        ref={(node) => { this.node = node; return node; }}
      >
        <div className="drop-down_head">
          <div className="label">{label}</div>
          <svg className="icon">
            <use xlinkHref={'#icon-list'} />
          </svg>
        </div>
        <div className="list">
          <div className="list-title">カラー

            <svg className="close" onClick={this.close}>
              <use xlinkHref={'#icon-close'} />
            </svg>
          </div>
          {
            React.Children.map(
              children, child => React.cloneElement(child,
                { onClick: () => this.select(child.props.children, child.props['data-meta']) }
              )
            )
          }
          <div className="list-selected">
            <span>選択カラー: </span>
            <span className="color" style={{ backgroundColor: selected.value }} /> {selected.title}
          </div>
        </div>
      </div>
    );
  }
}

export default DropDownColor;

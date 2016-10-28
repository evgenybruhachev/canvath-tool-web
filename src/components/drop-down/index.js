import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

class DropDown extends Component{
  constructor(props){

    super(props);

    this.state = {
      active: false,
      label: 'Select'
    }

    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._openList = this._openList.bind(this);
    this._select = this._select.bind(this);
  }

  componentDidMount() {
    this.setState(state => Object.assign(state, {label: this.props.label}));
    document.addEventListener('click', this._handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._handleClickOutside, true);
  }

  _handleClickOutside(e) {
    const domNode = ReactDOM.findDOMNode(this);
    if(!domNode.contains(e.target)) {
      this.setState(state => Object.assign(state, {active: false}));
    }
  }

  _openList(e){
    if (e.target.classList.contains('drop-down_head')) {
      this.setState(state => Object.assign(state, {active: !this.state.active}));
    }
  }

  _select(val){
    this.setState(state => Object.assign(state, {label: val, active: false}));
  }

  render() {
    return (
      <button className={classNames('drop-down', {'active' : this.state.active })} label={this.props.label}
              style={this.props.style}
              onClick={this.props.onClick || this._openList.bind(this)}>
        <span className="drop-down_head">
          <span className='label'>{this.state.label}</span>
          <svg className='icon'>
            <use xlinkHref={`#icon-list`}/>
          </svg>
          </span>
        <div className="list">
          {
            React.Children.map(
              this.props.children, child => {
                return React.cloneElement(child, {onClick: this._select.bind(this, child.props.children) })
              }
            )
          }
        </div>
      </button>
    )
  }
};

export default DropDown;
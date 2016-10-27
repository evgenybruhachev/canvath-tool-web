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

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this._openList = this._openList.bind(this);
    this._select = this._select.bind(this);
  }

  componentDidMount() {
    this.setState(state => Object.assign(state, {label: this.props.label}));
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside(e) {
    this.setState(state => Object.assign(state, {active: false}));
  }

  _openList(e){
    const domNode = ReactDOM.findDOMNode(this);
    if (domNode === e.target) {
      this.setState(state => Object.assign(state, {active: true}));
    }
  }

  _select(val){
    this.setState(state => Object.assign(state, {label: val, active: false}));
  }

  render() {
    return (
      <button className={classNames('drop-down', {'active' : this.state.active })} label={this.props.label}
              style={this.props.style}
              onClick={!this.state.active && (this.props.onClick || this._openList.bind(this))}>
        <span className='label'>{this.state.label}</span>
        <svg className='icon'>
          <use xlinkHref={`#icon-list`}/>
        </svg>
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
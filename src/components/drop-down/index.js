import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class DropDown extends Component{
  _toggleList(){
    this.refs._list.classList.toggle('active');
  }

  componentDidMount() {
    this.__wrappedComponent = this.refs.dropDown;
    document.addEventListener('click', this.handleClickOutside.bind(this), true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside.bind(this), true);
  }

  handleClickOutside(e) {
    const domNode = ReactDOM.findDOMNode(this);
    if (!domNode.contains(e.target)) {

      this.refs._list.classList.remove('active');
    }
  }

  render() {
    return (
      <button className='drop-down' ref="dropDown" label={this.props.label} style={this.props.style}
              onClick={this.props.onClick || this._toggleList.bind(this)}>
        <span className='label'>{this.props.label}</span>
        <svg className='icon'>
          <use xlinkHref={`#icon-list`}/>
        </svg>
        <div className="list" ref="_list">
          {this.props.children}
        </div>
      </button>
    )
  }
};

DropDown.propTypes = {
  label: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func,
  onClick: React.PropTypes.func,
  style: React.PropTypes.object,
};

export default DropDown;
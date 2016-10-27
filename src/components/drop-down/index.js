import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class DropDown extends Component{
  constructor(props){
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this._openList = this._openList.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside(e) {
    const domNode = ReactDOM.findDOMNode(this);
    if (!domNode.contains(e.target)) {

      this.refs.dropDown.classList.remove('active');
    }
  }

  _openList(){
    this.refs.dropDown.classList.add('active');
  }

  render() {
    return (
      <button className='drop-down' ref="dropDown" label={this.props.label} style={this.props.style}
              onClick={this.props.onClick || this._openList.bind(this)}>
        <span className='label'>{this.props.label}</span>
        <svg className='icon'>
          <use xlinkHref={`#icon-list`}/>
        </svg>
        <div className="list">
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
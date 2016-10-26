import React, { Component } from 'react';
import Ink from 'react-ink';

import FlatButton from '../flat-button';


class ProductLoad extends Component{

  componentDidMount() {
    document.body.classList.add('fixed');
  }

  componentWillUnmount() {
    document.body.classList.remove('fixed');
  }

  render() {

    const {onSelect, close, title, back} = this.props;

    return (
      <div className='product-load'>
        <div className="head">
          <div className="aside">
            {back && <FlatButton icon={'back'} label={'back'} onClick={back}/>}
          </div>
          <div className="title">{title}</div>
          <div className="aside">
            <FlatButton icon={'close'} label={'esc'} onClick={close}/>
          </div>
        </div>
        
        <div className="content">{this.props.children}</div>
      </div>
    )
  }

};

ProductLoad.propTypes = {
  onSelect: React.PropTypes.func,
  items: React.PropTypes.array
};

export default ProductLoad;
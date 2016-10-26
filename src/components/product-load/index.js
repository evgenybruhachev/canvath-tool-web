import React, { Component } from 'react';
import Ink from 'react-ink';

import FlatButton from '../flat-button';
import ProductCard from '../product-card';

import {items} from '../../api/products';

class ProductLoad extends Component{

  componentDidMount() {
    document.body.classList.add('fixed');
  }

  componentWillUnmount() {
    document.body.classList.remove('fixed');
  }

  render() {

    const {onSelect, close} = this.props;

    return (
      <div className='product-load'>
        <div className="head">
          <div className="back"></div>
          <div className="title">テンプレート</div>
          <FlatButton icon={'close'} label={'esc'} onClick={close}/>
        </div>
        
        <div className="content">
          {items.map((item, index) => <ProductCard key={index} image={item.img} images={item.previews}/>)}

        </div>
      </div>
    )
  }

};

ProductLoad.propTypes = {
  onSelect: React.PropTypes.func,
  items: React.PropTypes.array
};

export default ProductLoad;
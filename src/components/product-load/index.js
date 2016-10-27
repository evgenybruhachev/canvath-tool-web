import React, { Component } from 'react';
import Ink from 'react-ink';
import MediaQuery from 'react-responsive';

import FlatButton from '../flat-button';


class ProductLoad extends Component{

  constructor(props){
    super(props);
    this._hide = this._hide.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', this._hide, true);
    document.body.classList.add('fixed');
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this._hide, true);
    document.body.classList.remove('fixed');
  }

  _hide(e){
    if(e.keyCode === 27){
      this.props.close.call();
    }
  }

  render() {

    const {onSelect, close, title, back} = this.props;

    return (
      <div className='product-load'>
        <div className="head">
          <div className="aside">
            <MediaQuery query='(min-width: 769px)'>
              {back && <FlatButton icon={'back'} label={'back'} onClick={back}/>}
            </MediaQuery>
            <MediaQuery query='(max-width: 768px)'>
              {back && <FlatButton icon={'back-m'} label={'back'} onClick={back}/>}
            </MediaQuery>
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
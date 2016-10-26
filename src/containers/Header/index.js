import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import IconButton from '../../components/icon-button';
import DropDown from '../../components/drop-down';
import Price from '../../components/cart-button';

import * as ProductActions from '../../actions/product';

class Header extends Component{

  render(){

    const { load_product_container, actions } = this.props;

    return (
      <div className='app-header'>
        <img src="assets/logo.png" alt="Nobori" className='logo'/>
        <IconButton icon="poster" label='開く' onClick={actions.toggle_load_product_container}/>
        <IconButton icon="save" label='開く' />
        <DropDown label='Type' style={{width: 200+'px'}}/>
        <DropDown label='Side' />
        <DropDown label='Color' />
        <Price value='5000' />
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    load_product_container: state.product.load_product_container
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProductActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
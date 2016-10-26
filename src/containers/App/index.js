import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MediaQuery from 'react-responsive';

import Header from '../Header';
import HeaderMobile from '../HeaderMobile';
import Toolbar from '../Toolbar';

import ProductLoad from '../../components/product-load';
import ProductCard from '../../components/product-card';

import * as ProductActions from '../../actions/product';

import {items} from '../../api/products';

class App extends Component {

  _closeProductLoad(){
    this.props.actions.toggle_load_product_container(false);
  }

  _closeCategorySelect(){
    this.props.actions.toggle_load_product_category_container(false);
  }

  _goToCategory(){
    this.props.actions.toggle_load_product_category_container(false);
    this.props.actions.toggle_load_product_type_container(true);
  }

  _closeTypeSelector(){
    this.props.actions.toggle_load_product_type_container(false);
  }

  _typeSelectorBack(){
    this.props.actions.toggle_load_product_type_container(false);
    this.props.actions.toggle_load_product_category_container(true);
  }

  render() {

    const { load_product_container, load_product_category_container, load_product_type_container } = this.props;

    return (
      <div className='app'>

        <MediaQuery query='(min-width: 769px)'>
          <Header/>
        </MediaQuery>

        <MediaQuery query='(max-width: 768px)'>
          <HeaderMobile/>
        </MediaQuery>

        <div className='app-container'>
          <Toolbar/>
        </div>

        { load_product_container ? <ProductLoad title={'テンプレート'} close={this._closeProductLoad.bind(this)}>
          {items.map((item, index) => <ProductCard key={index} image={item.img} images={item.previews}/>)}
        </ProductLoad> : null }

        { load_product_category_container ? <ProductLoad title={'カテゴリ'}
                                                         close={this._closeCategorySelect.bind(this)}>
          {items.map((item, index) => <ProductCard key={index} title={'小カワテ飛問'} image={item.img}
                                                   actionTitle={'選択'}
                                                   onClick={this._goToCategory.bind(this)}/>)}
        </ProductLoad> : null }

        { load_product_type_container ? <ProductLoad title={'カテゴリ'}
                                                     close={this._closeTypeSelector.bind(this)}
                                                     back={this._typeSelectorBack.bind(this)}>
          {items.map((item, index) => <ProductCard key={index} title={'小カワテ飛問'} image={item.img}
                                                   images={item.previews}/>)}
        </ProductLoad> : null }

      </div>
    );
  };

};


function mapStateToProps(state) {
  return {
    load_product_container: state.product.load_product_container,
    load_product_category_container: state.product.load_product_category_container,
    load_product_type_container: state.product.load_product_type_container
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
)(App);


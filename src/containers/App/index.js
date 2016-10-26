import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MediaQuery from 'react-responsive';

import Header from '../Header';
import HeaderMobile from '../HeaderMobile';
import Toolbar from '../Toolbar';

import ProductLoad from '../../components/product-load';

import * as ProductActions from '../../actions/product';

class App extends Component {

  render() {

    const { load_product_container, actions } = this.props;

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

        { load_product_container ? <ProductLoad close={actions.toggle_load_product_container} /> : null }

      </div>
    );
  };

};


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
)(App);


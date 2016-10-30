import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MediaQuery from 'react-responsive';

import Header from '../Header';
import HeaderMobile from '../HeaderMobile';
import Toolbar from '../Toolbar';
import Options from '../Options';
import MobileNavigation from '../MobileNavigation';

import ProductLoad from '../../components/product-load';
import ProductCard from '../../components/product-card';
import Button from '../../components/button';

import * as ProductActions from '../../actions/product';

import items from '../../api/products';

class App extends Component {

  static propTypes = {
    actions: React.PropTypes.obj,
    loadProductContainer: React.PropTypes.bool,
    loadProductCatContainer: React.PropTypes.bool,
    loadProductTypeContainer: React.PropTypes.bool,
    // mobileNavigation: React.PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.closeProductLoad = this.closeProductLoad.bind(this);
    this.closeCategorySelect = this.closeCategorySelect.bind(this);
    this.goToCategory = this.goToCategory.bind(this);
    this.closeTypeSelector = this.closeTypeSelector.bind(this);
    this.typeSelectorBack = this.typeSelectorBack.bind(this);
    this.mobileClose = this.mobileClose.bind(this);
    this.mobileBack = this.mobileBack.bind(this);
  }

  closeProductLoad() {
    this.props.actions.toggleLoadProductContainer(false);
  }

  closeCategorySelect() {
    this.props.actions.toggleLoadProductCategoryContainer(false);
  }

  goToCategory() {
    this.props.actions.toggleLoadProductCategoryContainer(false);
    this.props.actions.toggleLoadProductTypeContainer(true);
  }

  closeTypeSelector() {
    this.props.actions.toggleLoadProductTypeContainer(false);
  }

  typeSelectorBack() {
    this.props.actions.toggleLoadProductTypeContainer(false);
    this.props.actions.toggleLoadProductCategoryContainer(true);
  }

  mobileClose() {
    this.props.actions.toggleMobileNavigation(false);
    this.closeProductLoad();
    this.closeCategorySelect();
    this.closeTypeSelector();
  }

  mobileBack() {
    this.props.actions.toggleLoadProductContainer(false);
    this.props.actions.toggleLoadProductCategoryContainer(false);
  }

  render() {
    const {
      loadProductContainer,
      loadProductCatContainer,
      loadProductTypeContainer,
    } = this.props;

    return (
      <div className="app">

        <MediaQuery query="(min-width: 769px)">
          <Header />
        </MediaQuery>

        <MediaQuery query="(max-width: 768px)">
          <HeaderMobile />
        </MediaQuery>

        <div className="app-container">
          <Toolbar />

          <MediaQuery query="(min-width: 769px)">
            <Button icon="trash" label={'全削除'} className={'trash'} />
          </MediaQuery>

          <div className="app-container-inner">
            <Options />
            <div>asdasdasd</div>
          </div>

        </div>

        <MediaQuery query="(min-width: 769px)">

          { loadProductContainer ? <ProductLoad
            title={'テンプレート'}
            close={this.closeProductLoad}
          >
            { items.map((item, index) => <ProductCard
              key={index}
              image={item.img}
              images={item.previews}
            />) }
          </ProductLoad> : null }

        </MediaQuery>

        <MediaQuery query="(max-width: 768px)">

          { loadProductContainer ? <ProductLoad
            title={'テンプレート'}
            close={this.mobileClose}
            back={this.mobileBack}
          >
            {items.map((item, index) => <ProductCard
              key={index}
              image={item.img}
              images={item.previews}
            />)}
          </ProductLoad> : null }

        </MediaQuery>


        <MediaQuery query="(min-width: 769px)">

          { loadProductCatContainer ? <ProductLoad
            title={'カテゴリ'}
            close={this.closeCategorySelect}
          >
            {items.map((item, index) => <ProductCard
              key={index}
              title={'小カワテ飛問'}
              image={item.img}
              actionTitle={'選択'}
              onClick={this.goToCategory}
            />)}
          </ProductLoad> : null }


          { loadProductTypeContainer ? <ProductLoad
            title={'Select type'}
            close={this.closeTypeSelector}
            back={this.typeSelectorBack}
          >
            {items.map((item, index) => <ProductCard
              key={index}
              title={'小カワテ飛問'}
              image={item.img}
              images={item.previews}
            />)}
          </ProductLoad> : null }

        </MediaQuery>

        <MediaQuery query="(max-width: 768px)">

          { loadProductCatContainer ? <ProductLoad
            title={'カテゴリ'}
            close={this.mobileClose}
            back={this.mobileBack}
          >
            {items.map((item, index) => <ProductCard
              key={index}
              title={'小カワテ飛問'}
              image={item.img}
              actionTitle={'選択'}
              onClick={this.goToCategory}
            />)}
          </ProductLoad> : null }


          { loadProductTypeContainer ? <ProductLoad
            title={'Select type'}
            close={this.mobileClose}
            back={this.typeSelectorBack}
          >
            {items.map((item, index) => <ProductCard
              key={index}
              title={'小カワテ飛問'}
              image={item.img}
              images={item.previews}
            />)}
          </ProductLoad> : null }

        </MediaQuery>


        <MobileNavigation />

      </div>
    );
  }

}


function mapStateToProps(state) {
  return {
    loadProductContainer: state.product.loadProductContainer,
    loadProductCatContainer: state.product.loadProductCatContainer,
    loadProductTypeContainer: state.product.loadProductTypeContainer,
    mobileNavigation: state.product.mobileNavigation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProductActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

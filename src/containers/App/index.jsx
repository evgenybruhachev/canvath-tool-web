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

import DrawTool from '../../draw-tool/drawtool';

import DrawToolComponent from '../../components/draw-tool';

import * as ProductActions from '../../actions/product';
import * as DrawToolActions from '../../actions/draw-tool';

import { api } from '../../api/products';

class App extends Component {

  static propTypes = {
    loadProductContainer: React.PropTypes.bool,
    loadProductCatContainer: React.PropTypes.bool,
    loadProductTypeContainer: React.PropTypes.bool,
    categories: React.PropTypes.array,
    products: React.PropTypes.array,
    colors: React.PropTypes.array,
    sides: React.PropTypes.object,
    dispatch: React.PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.goToCategory = this.goToCategory.bind(this);
    this.typeSelectorBack = this.typeSelectorBack.bind(this);
    this.mobileClose = this.mobileClose.bind(this);
    this.mobileBack = this.mobileBack.bind(this);
    this.loadProduct = this.loadProduct.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    api.getCategories().then(data => dispatch(ProductActions.loadCategories(data)));
  }

  goToCategory(id) {
    const { dispatch } = this.props;
    api.getProductsByCategory(id).then(data => dispatch(ProductActions.loadProducts(data)));
    dispatch(ProductActions.toggleLoadProductCategoryContainer(false));
    dispatch(ProductActions.toggleLoadProductTypeContainer(true));
  }

  typeSelectorBack() {
    const { dispatch } = this.props;
    dispatch(ProductActions.toggleLoadProductTypeContainer(false));
    dispatch(ProductActions.toggleLoadProductCategoryContainer(true));
  }

  mobileClose() {
    const { dispatch } = this.props;
    dispatch(ProductActions.toggleMobileNavigation(false));
    dispatch(ProductActions.toggleLoadProductCategoryContainer(false));
    dispatch(ProductActions.toggleLoadProductTypeContainer(false));

    dispatch(ProductActions.toggleLoadProductContainer(false));
  }

  mobileBack() {
    const { dispatch } = this.props;
    dispatch(ProductActions.toggleLoadProductContainer(false));
    dispatch(ProductActions.toggleLoadProductCategoryContainer(false));
  }

  loadProduct(id) {
    const { dispatch } = this.props;
    api.getProduct(id).then(data => dispatch(ProductActions.loadProduct(data)));
  }

  render() {
    const {
      loadProductContainer,
      loadProductCatContainer,
      loadProductTypeContainer,
      categories,
      products,
      dispatch,
      colors
    } = this.props;

    const items = [];

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
            <Button icon="trash" label={'全削除'} className={'trash'} onClick={DrawToolActions.empty} />
          </MediaQuery>

          <div className="app-container-inner">
            <Options />
            {colors && <DrawToolComponent colors={colors} />}
          </div>

        </div>

        <MediaQuery query="(min-width: 769px)">

          { loadProductContainer ? <ProductLoad
            title={'テンプレート'}
            close={() => dispatch(ProductActions.toggleLoadProductContainer(false))}
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
            close={() => dispatch(ProductActions.toggleLoadProductCategoryContainer(false))}
          >
            {categories.map((item, index) => <ProductCard
              key={index}
              title={item.Category.title}
              image={item.Category.image_url}
              actionTitle={'選択'}
              onClick={() => this.goToCategory(item.Category.id)}
            />)}
          </ProductLoad> : null }


          { loadProductTypeContainer ? <ProductLoad
            title={'Select type'}
            close={() => dispatch(ProductActions.toggleLoadProductTypeContainer(false))}
            back={this.typeSelectorBack}
          >
            {products.map((item, index) => <ProductCard
              key={index}
              title={item.Product.title}
              image={item.Product.image_url}
              images={item.Product.sides}
              onClick={() => this.loadProduct(item.Product.id)}
            />)}
          </ProductLoad> : null }

        </MediaQuery>

        <MediaQuery query="(max-width: 768px)">

          { loadProductCatContainer ? <ProductLoad
            title={'カテゴリ'}
            close={this.mobileClose}
            back={this.mobileBack}
          >
            {categories.map((item, index) => <ProductCard
              key={index}
              title={item.Category.title}
              image={item.Category.image_url}
              actionTitle={'選択'}
              onClick={() => this.goToCategory(item.Category.id)}
            />)}
          </ProductLoad> : null }


          { loadProductTypeContainer ? <ProductLoad
            title={'Select type'}
            close={this.mobileClose}
            back={this.typeSelectorBack}
          >
            {products.map((item, index) => <ProductCard
              key={index}
              title={item.Product.title}
              image={item.Product.image_url}
              images={item.Product.sides}
              onClick={() => this.loadProduct(item.id)}
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
    categories: state.product.categories,
    products: state.product.products,
    product: state.product.product,
    colors: state.product.colors,
    sideSelected: state.product.sideSelected,
  };
}

export default connect(
  mapStateToProps
)(App);

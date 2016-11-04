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

import escapeJSON from '../../utils/escapeJSON';

import * as ProductActions from '../../actions/product';
import * as DrawToolActions from '../../actions/draw-tool';

import { getCategories, getProductsByCategory, getProduct } from '../../api/products';
import { getBrushes, getFonts } from '../../api/options';
import { getShapes } from '../../api/extras';

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
    drawMode: React.PropTypes.bool,
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
    getCategories().then(data => dispatch(ProductActions.loadCategories(data)));
    getBrushes().then(data => dispatch(DrawToolActions.updateBrushes(data)));
    getFonts().then(data => dispatch(DrawToolActions.updateFonts(data)));
    getShapes().then(data => dispatch(DrawToolActions.updateShapes(data)));
  }

  goToCategory(id) {
    const { dispatch } = this.props;
    getProductsByCategory(id).then(data => dispatch(ProductActions.loadProducts(data)));
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
    const { dispatch, colors } = this.props;

    getProduct(id).then((data) => dispatch(ProductActions.loadProduct(data)));

    DrawTool.on('history:update', (e) => {
      let data = {
        layers: DrawTool.sides.selected.layers.update(),
        side: JSON.parse(e).side.id,
      };

      dispatch(DrawToolActions.updateLayers(data));
    });

    DrawTool.on('object:selected', () => {
      const item = DrawTool.sides.selected.items.selected.item;

      if (item.type === 'textbox') {
        dispatch(DrawToolActions.selectText(item));
      }
    });

    DrawTool.on('selection:cleared', () => {
      dispatch(DrawToolActions.selectTextOff());
    });
  }

  render() {
    const {
      loadProductContainer,
      loadProductCatContainer,
      loadProductTypeContainer,
      categories,
      products,
      dispatch,
      colors,
      drawMode,
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
            <Button disabled={drawMode} icon="trash" label={'全削除'} className={'trash'} onClick={() => dispatch(DrawToolActions.empty()) } />
          </MediaQuery>

          <div className="app-container-inner">
            <Options />
            <DrawToolComponent colors={colors} />
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
    drawMode: state.drawTool.drawMode,
  };
}

export default connect(
  mapStateToProps
)(App);

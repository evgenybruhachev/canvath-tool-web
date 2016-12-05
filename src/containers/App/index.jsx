import React, { Component } from 'react';
import { connect } from 'react-redux';

import MediaQuery from 'react-responsive';

import Header from '../Header';
import HeaderMobile from '../HeaderMobile';
import Toolbar from '../Toolbar';
import Options from '../Options';
import MobileNavigation from '../MobileNavigation';

import ProductLoad from '../../components/product-load';
import ProductCard from '../../components/product-card';

import DrawTool from '../../draw-tool/drawtool';

import DrawToolComponent from '../../components/draw-tool';

import * as ProductActions from '../../actions/product';
import * as DrawToolActions from '../../actions/draw-tool';

import { getCategories, getProductsByCategory, getProduct, removeTemplate } from '../../api/products';
import { getBrushes, getFonts } from '../../api/options';
import { getShapesCategories, getStickersCategories } from '../../api/extras';

class App extends Component {

  static propTypes = {
    loadProductContainer: React.PropTypes.bool,
    loadProductCatContainer: React.PropTypes.bool,
    loadProductTypeContainer: React.PropTypes.bool,
    categories: React.PropTypes.array,
    products: React.PropTypes.object,
    colors: React.PropTypes.array,
    sides: React.PropTypes.object,
    activeTool: React.PropTypes.string,
    dispatch: React.PropTypes.func,
    templates: React.PropTypes.array,
    currentCategory: React.PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.goToCategory = this.goToCategory.bind(this);
    this.typeSelectorBack = this.typeSelectorBack.bind(this);
    this.mobileClose = this.mobileClose.bind(this);
    this.mobileBack = this.mobileBack.bind(this);
    this.loadProduct = this.loadProduct.bind(this);
    this.removeTemplate = this.removeTemplate.bind(this);

    this.state = {
      category: '',
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    getCategories().then(data => dispatch(ProductActions.loadCategories(data)));
    getBrushes().then(data => dispatch(DrawToolActions.updateBrushes(data)));
    getFonts().then(data => dispatch(DrawToolActions.updateFonts(data)));
    getShapesCategories().then(data => dispatch(DrawToolActions.updateShapesCategories(data)));
    getStickersCategories().then(data => dispatch(DrawToolActions.updateStickersCategories(data)));
  }

  goToCategory(id, title) {
    const { dispatch } = this.props;
    getProductsByCategory(id).then((data) => {
      this.setState(state => Object.assign({}, state, { category: title }));
      dispatch(ProductActions.loadProducts({ id, data }));

      dispatch(ProductActions.toggleLoadProductCategoryContainer(false));
      dispatch(ProductActions.toggleLoadProductTypeContainer({ state: true, id }));
    });
  }

  typeSelectorBack() {
    const { dispatch } = this.props;
    dispatch(ProductActions.toggleLoadProductTypeContainer({ state: false }));
    dispatch(ProductActions.toggleLoadProductCategoryContainer(true));
  }

  mobileClose() {
    const { dispatch } = this.props;
    dispatch(ProductActions.toggleMobileNavigation(false));
    dispatch(ProductActions.toggleLoadProductCategoryContainer(false));
    dispatch(ProductActions.toggleLoadProductTypeContainer({ state: false }));

    dispatch(ProductActions.toggleLoadProductContainer(false));
  }

  mobileBack() {
    const { dispatch } = this.props;
    dispatch(ProductActions.toggleLoadProductContainer(false));
    dispatch(ProductActions.toggleLoadProductCategoryContainer(false));
  }

  loadProduct(id, colorId) {
    const { dispatch } = this.props;

    getProduct(id).then(data => dispatch(ProductActions.loadProduct(data, colorId)));

    DrawTool.on('history:update', () => {
      DrawTool.sides.selected.layers.update().then((layers) => {
        const data = {
          layers,
          side: DrawTool.sides.selected.id,
        };

        dispatch(DrawToolActions.updateHistory(DrawTool.history.history[DrawTool.sides.selected.id]));
        dispatch(DrawToolActions.updateLayers(data));

      });
    });

    DrawTool.on('object:selected', () => {
      const item = DrawTool.sides.selected.items.selected.item;
      dispatch(DrawToolActions.selectItem(item));
    });

    DrawTool.on('selection:cleared', () => {
      dispatch(DrawToolActions.unselectItem());
    });

    DrawTool.on('colorpicker:update', (color) => {
      dispatch(DrawToolActions.toggleColorPicker(false));
      dispatch(DrawToolActions.updateColorPicker(JSON.parse(color)));
    });
  }

  removeTemplate(id) {
    const { dispatch } = this.props;
    removeTemplate(id).then(() => dispatch(ProductActions.removeTemplate(id)));
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
      activeTool,
      currentCategory,
      templates,
    } = this.props;

    return (
      <div className="app">

        <MediaQuery query="(min-width: 1080px)">
          <Header />
        </MediaQuery>

        <MediaQuery query="(max-width: 1079px)">
          <HeaderMobile />
        </MediaQuery>

        <div className="app-container">
          <Toolbar />

          <div className="app-container-inner">
            <Options />
            <DrawToolComponent colors={colors} />
          </div>

        </div>

        <MediaQuery query="(min-width: 1080px)">

          { loadProductContainer ? <ProductLoad
            title={'テンプレート'}
            close={() => dispatch(ProductActions.toggleLoadProductContainer(false))}
          >
            { templates.length ? templates.map((item, index) => <ProductCard
              key={index}
              image={item.image_url}
              onClick={() => dispatch(ProductActions.applyTemplate(item.content_url))}
              removeBtn
              onRemove={() => this.removeTemplate(item.id)}
            />) : <span>保存された画像はありません</span> }
          </ProductLoad> : null }

        </MediaQuery>

        <MediaQuery query="(max-width: 1079px)">

          { loadProductContainer ? <ProductLoad
            title={'テンプレート'}
            close={this.mobileClose}
            back={this.mobileBack}
                                   >
            { templates.length ? templates.map((item, index) => <ProductCard
              key={index}
              image={item.image_url}
              onClick={() => dispatch(ProductActions.applyTemplate(item.content_url))}
              removeBtn
              onRemove={() => this.removeTemplate(item.id)}
                                                         />) : <span>保存された画像はありません</span> }
          </ProductLoad> : null }

        </MediaQuery>


        <MediaQuery query="(min-width: 1080px)">

          { loadProductCatContainer ? <ProductLoad
            title={'カテゴリ'}
            close={() => dispatch(ProductActions.toggleLoadProductCategoryContainer(false))}
          >
            {categories.map((item, index) => <ProductCard
              key={index}
              title={item.Category.title}
              image={item.Category.image_url}
              actionTitle={'選択'}
              onClick={() => this.goToCategory(item.Category.id, item.Category.title)}
            />)}
          </ProductLoad> : null }


          { loadProductTypeContainer ? <ProductLoad
            title={this.state.category}
            close={() => dispatch(ProductActions.toggleLoadProductTypeContainer({ state: false }))}
            back={this.typeSelectorBack}
          >
            {products[currentCategory].map((item, index) => <ProductCard
              key={index}
              title={item.Product.title}
              image={item.Product.image_url}
              images={item.Product.sides}
              onClick={() => this.loadProduct(item.Product.id, item.Product.sides[0].ProductColorSide.id)}
            />)}
          </ProductLoad> : null }

        </MediaQuery>

        <MediaQuery query="(max-width: 1079px)">

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
              onClick={() => this.goToCategory(item.Category.id, item.Category.title)}
            />)}
          </ProductLoad> : null }


          { loadProductTypeContainer ? <ProductLoad
            title={this.state.category}
            close={this.mobileClose}
            back={this.typeSelectorBack}
          >
            {products[currentCategory].map((item, index) => <ProductCard
              key={index}
              title={item.Product.title}
              image={item.Product.image_url}
              images={item.Product.sides}
              onClick={() => this.loadProduct(item.Product.id, item.Product.sides[0].ProductColorSide.id)}
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
    activeTool: state.drawTool.activeTool,
    templates: state.product.templates,
    currentCategory: state.product.currentCategory,
  };
}

export default connect(
  mapStateToProps
)(App);

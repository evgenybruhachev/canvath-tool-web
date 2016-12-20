import React, { Component } from 'react';
import { connect } from 'react-redux';
import { parse } from 'querystring';

import MediaQuery from 'react-responsive';

import query from '../../constants/query';
import Header from '../Header';
import HeaderMobile from '../HeaderMobile';
import Toolbar from '../Toolbar';
import Options from '../Options';
import MobileNavigation from '../MobileNavigation';
import Loader from '../../components/loader';

import ProductLoad from '../../components/product-load';
import ProductCard from '../../components/product-card';

import DrawTool from '../../draw-tool/drawtool';

import DrawToolComponent from '../../components/draw-tool';

import * as ProductActions from '../../actions/product';
import * as DrawToolActions from '../../actions/draw-tool';

import { getCategories, getProductsByCategory, getProduct, removeTemplate,
  getProductWithDesign, getDesign, getDefaultProduct } from '../../api/products';
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
    currentCategory: React.PropTypes.number,
    loading: React.PropTypes.bool,
    sidesPrice: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.goToCategory = this.goToCategory.bind(this);
    this.typeSelectorBack = this.typeSelectorBack.bind(this);
    this.mobileClose = this.mobileClose.bind(this);
    this.mobileBack = this.mobileBack.bind(this);
    this.loadProduct = this.loadProduct.bind(this);
    this.removeTemplate = this.removeTemplate.bind(this);
    this.loadProductWithDesign = this.loadProductWithDesign.bind(this);
    this.loadDefaultProduct = this.loadDefaultProduct.bind(this);
    this.calcPrice = this.calcPrice.bind(this);

    this.state = {
      category: '',
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;

    query.setData(parse(window.location.search.substring(1)));

    getCategories().then(data => dispatch(ProductActions.loadCategories(data)));
    getBrushes().then(data => dispatch(DrawToolActions.updateBrushes(data)));
    getFonts().then(data => dispatch(DrawToolActions.updateFonts(data)));
    getShapesCategories().then(data => dispatch(DrawToolActions.updateShapesCategories(data)));
    getStickersCategories().then(data => dispatch(DrawToolActions.updateStickersCategories(data)));

    if (query.item_id) {
      getProductWithDesign(query.item_id).then(data => this.loadProductWithDesign(data));
    } else if (query.design_id) {
      getDesign(query.design_id).then(data => this.loadProductWithDesign(data));
    } else if (query.color_id) {
      this.loadDefaultProduct(query.color_id, null);  
    } else if (query.model_id) {
      this.loadDefaultProduct(null, query.model_id);
    } else {
      this.loadDefaultProduct();
    }
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

  loadProduct(id) {
    const { dispatch } = this.props;

    getProduct(id).then(data => dispatch(ProductActions.loadProduct(data)));

    DrawTool.on('history:update', () => {
      const layers = DrawTool.sides.selected.layers.update();
      const data = {
        layers,
        side: DrawTool.sides.selected.id,
      };

      dispatch(DrawToolActions.updateHistory(DrawTool.history.history[DrawTool.sides.selected.id]));
      dispatch(DrawToolActions.updateLayers(data));

      this.calcPrice();
    });

    DrawTool.on('mouse:move', () => {
      if(DrawTool.sides.selected.drawingMode() && DrawTool.sides.selected.FabricCanvas.freeDrawingBrush.moved) {
        this.calcPrice();
      }
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

  loadDefaultProduct(model_id) {
    const { dispatch } = this.props;

    getDefaultProduct(model_id).then(data => dispatch(ProductActions.loadProduct(data.product)));

    DrawTool.on('history:update', () => {
      const layers = DrawTool.sides.selected.layers.update();
      const data = {
        layers,
        side: DrawTool.sides.selected.id,
      };

      dispatch(DrawToolActions.updateHistory(DrawTool.history.history[DrawTool.sides.selected.id]));
      dispatch(DrawToolActions.updateLayers(data));

      this.calcPrice();
    });

    DrawTool.on('mouse:move', () => {
      if(DrawTool.sides.selected.drawingMode() && DrawTool.sides.selected.FabricCanvas.freeDrawingBrush.moved) {
        this.calcPrice();
      }
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

  loadProductWithDesign(data) {
    const { dispatch } = this.props;

    dispatch(ProductActions.loadProductWithDesign(data));

    DrawTool.on('history:update', () => {
      const layers = DrawTool.sides.selected.layers.update();
      const data = {
        layers,
        side: DrawTool.sides.selected.id,
      };

      dispatch(DrawToolActions.updateHistory(DrawTool.history.history[DrawTool.sides.selected.id]));
      dispatch(DrawToolActions.updateLayers(data));

      this.calcPrice();
    });

    DrawTool.on('mouse:move', () => {
      if(DrawTool.sides.selected.drawingMode() && DrawTool.sides.selected.FabricCanvas.freeDrawingBrush.moved) {
        this.calcPrice();
      }
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

  calcPrice(){
    const { dispatch, sidesPrice } = this.props;

    let p = 0;

    for (const side in sidesPrice) {
      const sideObjects = DrawTool.sides.getSide(side).FabricCanvas.getObjects().filter(o => !o.excludeFromExport).length;
      const moved = DrawTool.sides.getSide(side).FabricCanvas.freeDrawingBrush.moved;
      if (sideObjects || moved) {
        p += sidesPrice[side];
      }
    }

    dispatch(ProductActions.updatePrice(p));
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
      loading,
    } = this.props;

    return (
      <div className="app">

        {loading ? <Loader /> : ''}

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
              onClick={() => this.loadProduct(item.Product.id)}
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
              onClick={() => this.loadProduct(item.Product.id)}
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
    sidesPrice: state.product.sidesPrice,
    loading: state.drawTool.loading,
  };
}

export default connect(
  mapStateToProps
)(App);

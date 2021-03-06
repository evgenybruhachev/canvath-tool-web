import React, { Component } from 'react';
import { connect } from 'react-redux';
import { parse } from 'querystring';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-56273164-17');

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
import { getBrushes, getFonts, getFontsJP, getFontsEN, getCategoriesFonts } from '../../api/options';
import { getShapesCategories, getStickersCategories, getColors } from '../../api/extras';

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
      loadFont: false
    };

    ReactGA.set({ page: window.location.pathname + window.location.search });
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentWillMount() {
    const { dispatch } = this.props;

    query.setData(parse(window.location.search.substring(1)));

    getCategories().then(data => dispatch(ProductActions.loadCategories(data)));
    getBrushes().then(data => dispatch(DrawToolActions.updateBrushes(data)));
    getCategoriesFonts().then(data => dispatch(DrawToolActions.updateCategoriesFonts(data)));
    getShapesCategories().then(data => dispatch(DrawToolActions.updateShapesCategories(data)));
    getStickersCategories().then(data => dispatch(DrawToolActions.updateStickersCategories(data)));
    getColors().then((data) => {
      DrawTool.colors = [];
      Array.prototype.forEach.call(data.colors, (color) => {
        DrawTool.colors.push(color.DrawerColor.value);
      });
    });



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

    //Add custom rotation icon
    DrawTool.setCustomiseControls({
      mtr: {
        src: 'data:image/png;base64,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',
        size: {
          width: 30,
          height: 30
        },
        offset: {
          x: 0,
          y: -13.5
        }
      }
    });
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
      const layers = DrawTool.sides.selected.layers.update().reverse();
      const data = {
        layers,
        side: DrawTool.sides.selected.id,
      };

      if (!DrawTool.sides.selected.FabricCanvas.freeDrawingBrush.moved) {
        dispatch(DrawToolActions.updateHistory(DrawTool.history.history[DrawTool.sides.selected.id]));
        dispatch(DrawToolActions.updateLayers(data));
      }

      this.calcPrice();
    });

    DrawTool.on('mouse:move', () => {
      if (DrawTool.sides.selected) {
        if(DrawTool.sides.selected.drawingMode() && DrawTool.sides.selected.FabricCanvas.freeDrawingBrush.moved) {
          this.calcPrice();
        }
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

  loadDefaultProduct(color_id, model_id) {
    const { dispatch } = this.props;

    if (color_id) {
      getDefaultProduct(color_id).then(data => {
        const product = data.product;
        product.colors.forEach(c => (c.ProductColor.is_main = 0));
        const selectedColor = product.colors.find(c => c.ProductColor.id === color_id);
        selectedColor.ProductColor.is_main = 1;

        dispatch(ProductActions.loadProduct(product));
      });
    } else if (model_id) {
      getDefaultProduct(null, model_id).then(data => {
        dispatch(ProductActions.loadProduct(data.product));
      });
    } else {
      getDefaultProduct().then(data => {
        dispatch(ProductActions.loadProduct(data.product));
      });
    }

    DrawTool.on('history:update', () => {
      const layers = DrawTool.sides.selected.layers.update().reverse();
      const data = {
        layers,
        side: DrawTool.sides.selected.id,
      };

      if (!DrawTool.sides.selected.FabricCanvas.freeDrawingBrush.moved) {
        dispatch(DrawToolActions.updateHistory(DrawTool.history.history[DrawTool.sides.selected.id]));
        dispatch(DrawToolActions.updateLayers(data));
      }

      this.calcPrice();
    });

    DrawTool.on('mouse:move', () => {
      if (DrawTool.sides.selected) {
        if (DrawTool.sides.selected.drawingMode() && DrawTool.sides.selected.FabricCanvas.freeDrawingBrush.moved) {
          this.calcPrice();
        }
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
      const layers = DrawTool.sides.selected.layers.update().reverse();
      const data = {
        layers,
        side: DrawTool.sides.selected.id,
      };

      if (!DrawTool.sides.selected.FabricCanvas.freeDrawingBrush.moved) {
        dispatch(DrawToolActions.updateHistory(DrawTool.history.history[DrawTool.sides.selected.id]));
        dispatch(DrawToolActions.updateLayers(data));
      }

      this.calcPrice();
    });

    DrawTool.on('mouse:move', () => {
      if (DrawTool.sides.selected) {
        if(DrawTool.sides.selected.drawingMode() && DrawTool.sides.selected.FabricCanvas.freeDrawingBrush.moved) {
          this.calcPrice();
        }
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

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading) {
      if (!this.state.loadFont) {
        this.state.loadFont = true;
        this.loadFonts();
      }
    }
  }

  loadFonts() {
    const { dispatch } = this.props;
    getFonts().then(data => dispatch(DrawToolActions.updateFonts(data)));
    getFontsJP().then(data => {
      if(typeof data != 'undefined' && data.length > 0)
        dispatch(DrawToolActions.updateFontsJP(data));
    });
    getFontsEN().then(data => {
      if(typeof data != 'undefined' && data.length > 0)
        dispatch(DrawToolActions.updateFontsEN(data));
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
      activeTool,
      currentCategory,
      templates,
      loading,

        } = this.props;

    return (
      <div className="app">

        {loading ? <Loader /> : ''}

        <MediaQuery query="(min-width: 1080px)">
          <Header calcPrice={this.calcPrice} loading={this.props.loading}/>
        </MediaQuery>

        <MediaQuery query="(max-width: 1079px)">
          <HeaderMobile calcPrice={this.calcPrice} loading={this.props.loading}/>
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

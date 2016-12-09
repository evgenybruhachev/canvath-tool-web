import { handleActions } from 'redux-actions';

const initialState = {
  loadProductContainer: false,
  loadProductCatContainer: false,
  loadProductTypeContainer: false,
  mobileNavigation: false,
  categories: [],
  products: {},
  product: null,
  colorSelected: null,
  sideSelected: null,
  templates: [],
  currentCategory: null,
};

export default handleActions({

  TOGGLE_LOAD_PRODUCT_CONTAINER: (state, action) => Object.assign({}, state, {
    loadProductContainer: action.payload,
  }),

  TOGGLE_LOAD_PRODUCT_CATEGORY_CONTAINER: (state, action) => Object.assign({}, state, {
    loadProductCatContainer: action.payload,
  }),

  TOGGLE_LOAD_PRODUCT_TYPE_CONTAINER: (state, action) => Object.assign({}, state, {
    loadProductTypeContainer: action.payload.state,
    currentCategory: action.payload.id || state.currentCategory,
  }),

  TOGGLE_MOBILE_NAVIGATION: (state, action) => Object.assign({}, state, {
    mobileNavigation: action.payload,
  }),

  LOAD_CATEGORIES: (state, action) => Object.assign({}, state, {
    categories: action.payload,
  }),

  LOAD_PRODUCTS: (state, action) => Object.assign({}, state, {
    products: { [action.payload.id]: action.payload.data },
  }),

  LOAD_PRODUCT: (state, action) => {
    const color = action.payload.colors.find((c) => {
      return !!c.ProductColor.is_main;
    });
    return Object.assign({}, state, {
      colorSelected: color.ProductColor,
      sideSelected: color.sides[0].ProductColorSide,
      product: action.payload.Product,
      colors: action.payload.colors,
      loadProductTypeContainer: false,
      mobileNavigation: false,
    });
  },

  SELECT_COLOR: (state, action) => Object.assign({}, state, {
    colorSelected: state.colors
    .find(color => color.ProductColor.id === action.payload).ProductColor,
    mobileNavigation: false,
  }),

  SELECT_SIDE: (state, action) => Object.assign({}, state, {
    sideSelected: state.colors
    .find(color => color.ProductColor.id === state.colorSelected.id).sides
    .find(side => side.ProductColorSide.id === action.payload).ProductColorSide,
    mobileNavigation: false,
  }),

  UPDATE_TEMPLATES: (state, action) => Object.assign({}, state, {
    templates: action.payload.map(template => template.DesignTemplate),
  }),

  APPLY_TEMPLATE: (state, action) => Object.assign({}, state, {
    loadProductContainer: false,
    mobileNavigation: false,
  }),

  SAVE_TEMPLATE: (state, action) => Object.assign({}, state, {
    mobileNavigation: false,
  }),

  REMOVE_TEMPLATE: (state, action) => Object.assign({}, state, {
    templates: state.templates.filter(template => template.id !== action.payload),
  }),

}, initialState);

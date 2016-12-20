import { createAction } from 'redux-actions';

export const toggleLoadProductContainer = createAction('TOGGLE_LOAD_PRODUCT_CONTAINER');
export const toggleLoadProductCategoryContainer = createAction('TOGGLE_LOAD_PRODUCT_CATEGORY_CONTAINER');
export const toggleLoadProductTypeContainer = createAction('TOGGLE_LOAD_PRODUCT_TYPE_CONTAINER');
export const toggleMobileNavigation = createAction('TOGGLE_MOBILE_NAVIGATION');
export const loadCategories = createAction('LOAD_CATEGORIES');
export const loadProducts = createAction('LOAD_PRODUCTS');
export const selectColor = createAction('SELECT_COLOR');
export const selectSide = createAction('SELECT_SIDE');
export const loadProduct = createAction('LOAD_PRODUCT');
export const saveTemplate = createAction('SAVE_TEMPLATE');
export const updateTemplates = createAction('UPDATE_TEMPLATES');
export const applyTemplate = createAction('APPLY_TEMPLATE');
export const removeTemplate = createAction('REMOVE_TEMPLATE');
export const loadProductWithDesign = createAction('LOAD_PRODUCT_WITH_DESIGN');
export const updatePrice = createAction('UPDATE_PRICE');

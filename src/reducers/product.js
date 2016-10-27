import { handleActions } from 'redux-actions';

const initialState = {
  load_product_container: false,
  load_product_category_container: false,
  load_product_type_container: false,
  mobile_navigation: false
};

export default handleActions({

  'TOGGLE_LOAD_PRODUCT_CONTAINER' (state, action) {
    return Object.assign({}, state, {
      load_product_container: action.payload
    })
  },

  'TOGGLE_LOAD_PRODUCT_CATEGORY_CONTAINER' (state, action) {
    return Object.assign({}, state, {
      load_product_category_container: action.payload
    })
  },

  'TOGGLE_LOAD_PRODUCT_TYPE_CONTAINER' (state, action) {
    return Object.assign({}, state, {
      load_product_type_container: action.payload
    })
  },

  'TOGGLE_MOBILE_NAVIGATION' (state, action){
    return Object.assign({}, state, {
      mobile_navigation: action.payload
    })
  }

}, initialState)
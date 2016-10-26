import { handleActions } from 'redux-actions';

const initialState = {
  load_product_container: false
};

export default handleActions({

  'TOGGLE_LOAD_PRODUCT_CONTAINER' (state, action) {
    return {
      load_product_container: !state.load_product_container
    }
  }

}, initialState)
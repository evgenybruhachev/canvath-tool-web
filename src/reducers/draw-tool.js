import { handleActions } from 'redux-actions';

const initialState = {
  active_tool: 'pointer'
};

export default handleActions({

  'SET_ACTIVE_TOOL' (state, action) {
    return {
      active_tool: action.payload
    }
  }

}, initialState)
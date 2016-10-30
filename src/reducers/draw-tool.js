import { handleActions } from 'redux-actions';

const initialState = {
  activeTool: 'pointer',
};

export default handleActions({

  SET_ACTIVE_TOOL: (state, action) => Object.assign({}, state, {
    activeTool: action.payload,
  }),

}, initialState);

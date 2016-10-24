import { handleActions } from 'redux-actions';

const initialState = {
  value: 0,
  lastValue: 0
};

export default handleActions({

  ['plus'] (state, action) {
    return {
      value: parseInt(state.value + action.payload),
      lastValue: '+' + action.payload
    }
  },

  ['minus'] (state, action) {
    return {
      value: parseInt(state.value - action.payload),
      lastValue: '-' + action.payload
    }
  }

}, initialState)
import { handleActions } from 'redux-actions';

const initialState = {
  activeTool: 'pointer',
  activeBrush: 'pencilBrush',
  brushOptions: {
    color: '#ffaaff',
    width: 2,
    opacity: 1,
  },
};

export default handleActions({
  UPDATE_BRUSHES: (state, action) => Object.assign({}, state, {
    availableBrushes: action.payload.map(brush => brush.DrawerBrush.value),
  }),
  SET_ACTIVE_TOOL: (state, action) => Object.assign({}, state, {
    activeTool: action.payload,
  }),
  SELECT_BRUSH: (state, action) => Object.assign({}, state, {
    activeBrush: action.payload,
  }),
  SELECT_BRUSH_COLOR: (state, action) => Object.assign({}, state, {
    brushOptions: Object.assign({}, state.brushOptions, { color: action.payload }),
  }),
  SELECT_BRUSH_SIZE: (state, action) => Object.assign({}, state, {
    brushOptions: Object.assign({}, state.brushOptions, { width: action.payload }),
  }),
  SELECT_BRUSH_OPACITY: (state, action) => Object.assign({}, state, {
    brushOptions: Object.assign({}, state.brushOptions, { opacity: action.payload }),
  }),

}, initialState);

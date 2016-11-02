import { handleActions } from 'redux-actions';

const initialState = {
  activeTool: 'pointer',
  activeBrush: 'pencilBrush',
  brushOptions: {
    color: '#ffaaff',
    width: 2,
    opacity: 1,
  },
  textOptions: {
    color: '#ffaaff',
    font: 'Verdana',
    size: 14,
    align: 'center',
    bold: false,
    italic: false,
  },
  layers: {},
};

export default handleActions({
  UPDATE_BRUSHES: (state, action) => Object.assign({}, state, {
    availableBrushes: action.payload.map(brush => brush.DrawerBrush.value),
  }),
  UPDATE_FONTS: (state, action) => Object.assign({}, state, {
    availableFonts: action.payload.map(font => font.DrawerFont.title),
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

  SELECT_TEXT_COLOR: (state, action) => Object.assign({}, state, {
    textOptions: Object.assign({}, state.textOptions, { color: action.payload }),
  }),

  SELECT_TEXT_FONT: (state, action) => Object.assign({}, state, {
    textOptions: Object.assign({}, state.textOptions, { font: action.payload }),
  }),
  SELECT_TEXT_SIZE: (state, action) => Object.assign({}, state, {
    textOptions: Object.assign({}, state.textOptions, { size: action.payload }),
  }),
  SELECT_TEXT_ALIGN: (state, action) => Object.assign({}, state, {
    textOptions: Object.assign({}, state.textOptions, { align: action.payload }),
  }),
  SELECT_TEXT_BOLD: (state, action) => Object.assign({}, state, {
    textOptions: Object.assign({}, state.textOptions, { bold: action.payload }),
  }),
  SELECT_TEXT_ITALIC: (state, action) => Object.assign({}, state, {
    textOptions: Object.assign({}, state.textOptions, { italic: action.payload }),
  }),
  SELECT_TEXT_VERTICAL: (state, action) => Object.assign({}, state, {
    textOptions: Object.assign({}, state.textOptions, { vertical: action.payload }),
  }),

  UPDATE_LAYERS: (state, action) => Object.assign({}, state, {
    layers: Object.assign({}, state.layers, { [action.payload.side]: action.payload.layers }),
  }),


}, initialState);

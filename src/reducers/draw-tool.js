import { handleActions } from 'redux-actions';

const initialState = {
  activeTool: 'pointer',
  activeBrush: '',
  brushOptions: {
    color: 'rgba(0, 162, 255, 1)',
    width: 20,
  },
  textEl: null,
  text: '',
  textOptions: {
    color: 'rgba(0, 162, 255, 1)',
    font: 'Verdana',
    size: 14,
    align: 'center',
    bold: false,
    italic: false,
    vertical: false,
  },
  layers: {},
  layersSelected: [],
  color: 'rgba(0, 162, 255, 1)',
  shapeColor: 'rgba(0, 162, 255, 1)',
};

export default handleActions({
  UPDATE_BRUSHES: (state, action) => Object.assign({}, state, {
    availableBrushes: action.payload.map(brush => brush.DrawerBrush.value),
    activeBrush: action.payload[0].DrawerBrush.value,
  }),
  UPDATE_FONTS: (state, action) => Object.assign({}, state, {
    availableFonts: action.payload.map(font => font.DrawerFont.title),
    textOptions: Object.assign(state.textOptions, { font: action.payload[0].DrawerFont.title }),
  }),
  UPDATE_SHAPES: (state, action) => Object.assign({}, state, {
    availableShapes: action.payload.map(shape => shape.DrawerShape.url),
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
  ADD_TEXT: (state, action) => Object.assign({}, state, {
    text: action.payload,
  }),
  CHANGE_TEXT: (state, action) => Object.assign({}, state, {
    text: action.payload,
  }),
  SELECT_TEXT: (state, action) => { console.log(action.payload.vertical); return Object.assign({}, state, {
    textEl: action.payload,
    text: action.payload.text,
    textOptions: {
      color: action.payload.fill,
      font: action.payload.fontFamily,
      size: action.payload.fontSize,
      align: action.payload.textAlign,
      bold: action.payload.fontWeight === 'bold',
      italic: action.payload.fontStyle === 'italic',
      vertical: !!action.payload.vertical,
    },
  }); },
  SELECT_TEXT_OFF: (state, action) => Object.assign({}, state, {
    textEl: null,
    text: '',
  }),

  UPDATE_LAYERS: (state, action) => Object.assign({}, state, {
    layers: Object.assign({}, state.layers, { [action.payload.side]: action.payload.layers }),
    layersSelected: [],
  }),

  FOCUS_LAYER: (state, action) => Object.assign({}, state, {
    layersSelected: state.layersSelected.concat(action.payload),
  }),
  BLUR_LAYER: (state, action) => Object.assign({}, state, {
    layersSelected: state.layersSelected.filter(el => el !== action.payload),
  }),

  SELECT_SHAPE_COLOR: (state, action) => Object.assign({}, state, {
    shapeColor: action.payload,
  }),

  SELECT_SHAPE: (state, action) => Object.assign({}, state, {
    shapeColor: action.payload.fill,
  }),


}, initialState);

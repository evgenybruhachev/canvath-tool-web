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
  stickersCat: [],
  stickers: [],
  colorPickerColor: 'rgba(0, 162, 255, 1)',
  colorPicker: false,
  availableShapesCategories: [],
  availableShapes: [],
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

  UPDATE_SHAPES_CATEGORIES: (state, action) => Object.assign({}, state, {
    availableShapesCategories: action.payload.map(shape => shape.DrawerShapeCategory),
  }),
  UPDATE_SHAPES: (state, action) => Object.assign({}, state, {
    availableShapes: action.payload.map(shape => shape.DrawerShape.url),
  }),
  UPDATE_STICKERS_CATEGORIES: (state, action) => Object.assign({}, state, {
    stickersCat: action.payload.map(cat => cat.DrawerStickerCategory),
  }),
  UPDATE_STICKERS: (state, action) => Object.assign({}, state, {
    stickers: action.payload.map(cat => cat.DrawerSticker.image_url),
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
  CHANGE_TEXT_VAL: (state, action) => Object.assign({}, state, {
    text: action.payload,
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

  TOGGLE_COLOR_PICKER: (state, action) => Object.assign({}, state, {
    colorPicker: action.payload,
  }),

  UPDATE_COLOR_PICKER: (state, action) => Object.assign({}, state, {
    colorPickerColor: action.payload,
  }),

  SELECT_ITEM: (state, action) => {
    let text = {};
    let shape = {};

    if (action.payload.type.includes('text')) {
      text = {
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
      };
    }

    if (action.payload.type.includes('path')) {
      shape = {
        shapeColor: action.payload.fill,
      };
    }

    return Object.assign({}, state, {
      selected: action.payload,
    }, text, shape);
  },

  UNSELECT_ITEM: (state, action) => Object.assign({}, state, {
    textEl: null,
    text: '',
    selected: null,
  }),

}, initialState);

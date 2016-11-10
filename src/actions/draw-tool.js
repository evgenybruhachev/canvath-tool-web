import { createAction } from 'redux-actions';

export const updateBrushes = createAction('UPDATE_BRUSHES');
export const updateFonts = createAction('UPDATE_FONTS');
export const updateShapesCategories = createAction('UPDATE_SHAPES_CATEGORIES');
export const updateShapes = createAction('UPDATE_SHAPES');
export const updateStickersCategories = createAction('UPDATE_STICKERS_CATEGORIES');
export const upload = createAction('UPLOAD');

export const insertImage = createAction('INSERT_IMAGE');

export const setActiveTool = createAction('SET_ACTIVE_TOOL');
export const empty = createAction('EMPTY');
export const zoomIn = createAction('ZOOM_IN');
export const zoomOut = createAction('ZOOM_OUT');
export const undo = createAction('UNDO');
export const redo = createAction('REDO');
export const remove = createAction('REMOVE');
export const selectBrush = createAction('SELECT_BRUSH');
export const selectBrushColor = createAction('SELECT_BRUSH_COLOR');
export const selectBrushSize = createAction('SELECT_BRUSH_SIZE');
export const selectBrushOpacity = createAction('SELECT_BRUSH_OPACITY');

export const addText = createAction('ADD_TEXT');
export const selectTextColor = createAction('SELECT_TEXT_COLOR');
export const selectTextFont = createAction('SELECT_TEXT_FONT');
export const selectTextSize = createAction('SELECT_TEXT_SIZE');
export const selectTextAlign = createAction('SELECT_TEXT_ALIGN');
export const selectTextBold = createAction('SELECT_TEXT_BOLD');
export const selectTextItalic = createAction('SELECT_TEXT_ITALIC');
export const selectTextVertical = createAction('SELECT_TEXT_VERTICAL');
export const selectText = createAction('SELECT_TEXT');
export const selectTextOff = createAction('SELECT_TEXT_OFF');
export const changeText = createAction('CHANGE_TEXT');
export const changeTextVal = createAction('CHANGE_TEXT_VAL');

export const updateLayers = createAction('UPDATE_LAYERS');

export const focusLayer = createAction('FOCUS_LAYER');
export const blurLayer = createAction('BLUR_LAYER');
export const alignLayer = createAction('ALIGN_LAYER');
export const sortLayers = createAction('SORT_LAYERS');

export const alignItem = createAction('ALIGN_ITEM');

export const selectShapeColor = createAction('SELECT_SHAPE_COLOR');
export const insertShape = createAction('INSERT_SHAPE');
export const selectShape = createAction('SELECT_SHAPE');

export const updateStickers = createAction('UPDATE_STICKERS');
export const toggleColorPicker = createAction('TOGGLE_COLOR_PICKER');
export const updateColorPicker = createAction('UPDATE_COLOR_PICKER');
export const removeColor = createAction('REMOVE_COLOR');

export const selectItem = createAction('SELECT_ITEM');
export const unselectItem = createAction('UNSELECT_ITEM');

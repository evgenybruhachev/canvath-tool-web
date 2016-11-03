import { createAction } from 'redux-actions';

export const updateBrushes = createAction('UPDATE_BRUSHES');
export const updateFonts = createAction('UPDATE_FONTS');

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

export const updateLayers = createAction('UPDATE_LAYERS');

export const alignLayer = createAction('ALIGN_LAYER');
export const alignItem = createAction('ALIGN_ITEM');

import { createAction } from 'redux-actions';

import DrawTool from '../draw-tool/drawtool';

export const setActiveTool = createAction('SET_ACTIVE_TOOL');
export const empty = createAction('EMPTY', () => DrawTool.sides.selected.empty);
export const zoomIn = createAction('ZOOM_IN', () => DrawTool.sides.selected.zoomIn());
export const zoomOut = createAction('ZOOM_OUT', () => DrawTool.sides.selected.zoomOut());
export const undo = createAction('UNDO', sideId => DrawTool.history.undo(sideId));
export const redo = createAction('REDO', sideId => DrawTool.history.redo(sideId));
export const remove = createAction('REMOVE', () => DrawTool.sides.selected.items.selected.remove());
export const selectBrush = createAction('SELECT_BRUSH');
export const selectBrushColor = createAction('SELECT_BRUSH_COLOR');
export const selectBrushSize = createAction('SELECT_BRUSH_SIZE');
export const selectBrushOpacity = createAction('SELECT_BRUSH_OPACITY');

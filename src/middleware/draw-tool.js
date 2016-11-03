import DrawTool from '../draw-tool/drawtool';

const isSelectedSide = () => DrawTool.sides && DrawTool.sides.selected;

export default store => next => (action) => {
  const {
    activeBrush,
    brushOptions,
    textOptions,
    layersSelected
  } = store.getState().drawTool;

  if (!isSelectedSide()) {
    return next(action);
  }

  switch (action.type) {
    case 'SET_ACTIVE_TOOL':
      if (action.payload === 'panning' && isSelectedSide()) {
        DrawTool.sides.selected.panning = true;
      } else if (action.payload !== 'panning' && isSelectedSide()) {
        DrawTool.sides.selected.panning = false;
      }
      break;
    case 'SELECT_BRUSH':
      DrawTool.sides.selected.items[action.payload](brushOptions);
      break;
    case 'SELECT_BRUSH_SIZE':
    case 'SELECT_BRUSH_OPACITY':
    case 'SELECT_BRUSH_COLOR':
      DrawTool.sides.selected.items[activeBrush](brushOptions);
      break;
    case 'TOGGLE_DRAW_MODE':
      if (action.payload) {
        DrawTool.sides.selected.drawingMode(true);
        DrawTool.sides.selected.items[activeBrush](brushOptions);
      } else {
        DrawTool.sides.selected.items.finalizeBrush();
        DrawTool.sides.selected.drawingMode(false);
      }
      break;
    case 'ADD_TEXT':
      const options = {
        fontSize: textOptions.size,
        fontFamily: textOptions.font,
        fontStyle: textOptions.italic ? 'italic' : 'normal',
        fontWeight: textOptions.bold ? 'bold' : 'normal',
        fill: textOptions.color,
        textAlign: textOptions.align,
        editable: false,
      }

      let text = action.payload;

      if (textOptions.vertical) {
        text = text.split('').join('\n');
      }
      DrawTool.sides.selected.items.addText(options, text);
      break;
    case 'UNDO':
      DrawTool.history.undo(DrawTool.sides.selected.id);
      break;
    case 'REDO':
      DrawTool.history.redo(DrawTool.sides.selected.id);
      break;
    case 'EMPTY':
      DrawTool.sides.selected.items.empty();
      break;
    case 'ZOOM_IN':
      DrawTool.sides.selected.zoomIn();
      break;
    case 'ZOOM_OUT':
      DrawTool.sides.selected.zoomOut();
      break;
    case 'REMOVE':
      DrawTool.sides.selected.items.selected.remove();
      break;
    case 'ALIGN_LAYER':
      DrawTool.sides.selected.layers[action.payload](...layersSelected);
      break;
    case 'ALIGN_ITEM':
      DrawTool.sides.selected.items.selected[action.payload]();
      break;
    default:

  }
  return next(action);
};

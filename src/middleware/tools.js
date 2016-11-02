import DrawTool from '../draw-tool/drawtool';

const isSelectedSide = () => DrawTool.sides && DrawTool.sides.selected;

export default store => next => (action) => {
  const { activeTool, activeBrush, brushOptions, textOptions } = store.getState().drawTool;

  if (isSelectedSide()) DrawTool.sides.selected.items.finalizeBrush();

  switch (action.type) {
    case 'SET_ACTIVE_TOOL':
      if (action.payload === 'brush' && isSelectedSide()) {
        DrawTool.sides.selected.drawingMode(true);
        DrawTool.sides.selected.items.pencilBrush(brushOptions);
      } else if (action.payload !== 'brush' && isSelectedSide()) {
        DrawTool.sides.selected.drawingMode(false);
      }
      if (action.payload === 'panning' && isSelectedSide()) {
        DrawTool.sides.selected.panning = true;
      } else if (action.payload !== 'panning' && isSelectedSide()) {
        DrawTool.sides.selected.panning = false;
      }
      break;
    case 'SELECT_BRUSH':
      if (isSelectedSide()) {
        DrawTool.sides.selected.items[action.payload](brushOptions);
      }
      break;
    case 'SELECT_BRUSH_SIZE':
    case 'SELECT_BRUSH_OPACITY':
    case 'SELECT_BRUSH_COLOR':
      if (isSelectedSide()) {
        DrawTool.sides.selected.items[activeBrush](brushOptions);
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

      if (isSelectedSide()) {
        DrawTool.sides.selected.items.addText(options, text);
      }
      break;
    case 'UNDO':
      if (isSelectedSide()) {
        DrawTool.history.undo(DrawTool.sides.selected.id)
      }
      break;
    case 'REDO':
      if (isSelectedSide()) {
        DrawTool.history.redo(DrawTool.sides.selected.id)
      }
      break;
    case 'EMPTY':
      if (isSelectedSide()) {
        DrawTool.sides.selected.items.empty();
      }
      break;
    case 'ZOOM_IN':
      if (isSelectedSide()) {
        DrawTool.sides.selected.zoomIn();
      }
      break;
    case 'ZOOM_OUT':
      if (isSelectedSide()) {
        DrawTool.sides.selected.zoomOut();
      }
      break;
    case 'REMOVE':
      if (isSelectedSide()) {
        DrawTool.sides.selected.items.selected.remove();
      }
      break;
    default:

  }
  return next(action);
};

import DrawTool from '../draw-tool/drawtool';

const isSelectedSide = () => DrawTool.sides && DrawTool.sides.selected;

export default store => next => (action) => {
  const { activeTool, activeBrush, brushOptions } = store.getState().drawTool;

  if (isSelectedSide()) DrawTool.sides.selected.items.finalizeBrush();

  switch (action.type) {
    case 'SET_ACTIVE_TOOL':
      if (action.payload === 'brush' && isSelectedSide()) {
        DrawTool.sides.selected.drawingMode(true);
        DrawTool.sides.selected.items.pencilBrush(brushOptions);
      } else if (action.payload !== 'brush' && isSelectedSide()) {
        DrawTool.sides.selected.drawingMode(false);
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
    default:

  }
  return next(action);
};

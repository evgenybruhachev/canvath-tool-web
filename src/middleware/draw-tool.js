import DrawTool from '../draw-tool/drawtool';

const isSelectedSide = () => DrawTool.sides && DrawTool.sides.selected;

export default store => next => (action) => {
  const {
    activeBrush,
    brushOptions,
    textOptions,
    layersSelected,
    shapeColor
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
    case 'ADD_TEXT': {
      const options = {
        fontSize: textOptions.size,
        fontFamily: textOptions.font,
        fontStyle: textOptions.italic ? 'italic' : 'normal',
        fontWeight: textOptions.bold ? 'bold' : 'normal',
        fill: textOptions.color,
        textAlign: textOptions.align,
        editable: false,
      };

      let text = action.payload;

      if (textOptions.vertical) {
        text = text.replace(/(\r\n|\n|\r)/gm, '').split('').join('\n');
      }
      DrawTool.sides.selected.items.addText(options, text);
      DrawTool.sides.selected.items.selected.item.vertical = textOptions.vertical;
      break;
    }
    case 'CHANGE_TEXT': {
      const options = {
        fontSize: textOptions.size,
        fontFamily: textOptions.font,
        fontStyle: textOptions.italic ? 'italic' : 'normal',
        fontWeight: textOptions.bold ? 'bold' : 'normal',
        fill: textOptions.color,
        textAlign: textOptions.align,
        editable: false,
      };

      let text = action.payload;

      if (textOptions.vertical) {
        text = text.replace(/(\r\n|\n|\r)/gm, '').split('').join('\n');
      }
      DrawTool.sides.selected.items.selected.text(action.payload);
      DrawTool.sides.selected.items.selected.item.vertical = textOptions.vertical;
      break;
    }
    case 'SELECT_TEXT_COLOR':
      DrawTool.sides.selected.items.selected.fill(action.payload);
      break;
    case 'SELECT_TEXT_FONT':
      DrawTool.sides.selected.items.selected.fontFamily(action.payload);
      break;
    case 'SELECT_TEXT_SIZE':
      DrawTool.sides.selected.items.selected.fontSize(action.payload);
      break;
    case 'SELECT_TEXT_ALIGN':
      DrawTool.sides.selected.items.selected.textAlign(action.payload);
      break;
    case 'SELECT_TEXT_BOLD':
      DrawTool.sides.selected.items.selected.fontWeight(action.payload ? 'bold' : 'normal');
      break;
    case 'SELECT_TEXT_ITALIC':
      DrawTool.sides.selected.items.selected.fontStyle(action.payload ? 'italic' : 'normal');
      break;
    case 'SELECT_TEXT_VERTICAL': {
      DrawTool.sides.selected.items.selected.item.vertical = action.payload;
      let text = DrawTool.sides.selected.items.selected.text();
      if (action.payload) {
        text = text.replace(/(\r\n|\n|\r)/gm, '').split('').join('\n');
      } else {
        text = text.replace(/(\r\n|\n|\r)/gm, '');
      }
      DrawTool.sides.selected.items.selected.text(text);
      break;
    }
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
    case 'INSERT_IMAGE':
      DrawTool.sides.selected.items.addImage(action.payload);
      break;
    case 'INSERT_SHAPE':
      DrawTool.sides.selected.items.addSVG(action.payload, shapeColor);
      break;
    case 'SELECT_SHAPE_COLOR':
      DrawTool.sides.selected.items.selected.fill(action.payload);
      break;
    default:

  }
  return next(action);
};

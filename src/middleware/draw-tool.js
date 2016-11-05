import DrawTool from '../draw-tool/drawtool';

const isSelectedSide = () => DrawTool.sides && DrawTool.sides.selected;

export default store => next => (action) => {
  const {
    activeBrush,
    brushOptions,
    textOptions,
    layersSelected,
    shapeColor,
  } = store.getState().drawTool;

  if (!isSelectedSide()) {
    return next(action);
  }

  if (!(action.type === 'UPDATE_LAYERS' || action.type === 'SELECT_TEXT_OFF')) {
    DrawTool.sides.selected.items.finalizeBrush();
  }

  switch (action.type) {
    case 'SET_ACTIVE_TOOL':
      if (action.payload === 'brush' && isSelectedSide()) {
        DrawTool.sides.selected.drawingMode(true);
        DrawTool.sides.selected.items[activeBrush](brushOptions);
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
      DrawTool.sides.selected.items[action.payload](brushOptions);
      break;
    case 'SELECT_BRUSH_SIZE':
      DrawTool.sides.selected.items[activeBrush](Object.assign(brushOptions, {width: action.payload}));
      break;
    case 'SELECT_BRUSH_COLOR':
      DrawTool.sides.selected.items[activeBrush](Object.assign(brushOptions, {color: action.payload}));
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
        vertical: textOptions.vertical,
      };

      let text = action.payload;

      if (options.vertical) {
        text = text.replace(/(\r\n|\n|\r)/gm, '').split('').join('\n');
      }
      DrawTool.sides.selected.items.addText(options, text);
      break;
    }
    case 'CHANGE_TEXT': {
      let text = action.payload;

      if (text.length) {
        if (textOptions.vertical) {
          text = text.replace(/(\r\n|\n|\r)/gm, '').split('').join('\n');
        }
        DrawTool.sides.selected.items.selected.text(text);
        DrawTool.sides.selected.items.selected.item.vertical = textOptions.vertical;
      }
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
      if (DrawTool.sides.selected.items.selected.item) {
        DrawTool.sides.selected.items.selected.item.vertical = action.payload;

        let text = DrawTool.sides.selected.items.selected.text();
        if (action.payload) {
          text = text.replace(/(\r\n|\n|\r)/gm, '').split('').join('\n');
        } else {
          text = text.replace(/(\r\n|\n|\r)/gm, '');
        }
        DrawTool.sides.selected.items.selected.text(text);
      }
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
      DrawTool.sides.selected.items.addImage(`${action.payload}?_`);
      break;
    case 'INSERT_SHAPE':
      console.log(shapeColor);
      DrawTool.sides.selected.items.addSVG(`${action.payload}?_`, shapeColor);
      break;
    case 'SELECT_SHAPE_COLOR':
      DrawTool.sides.selected.items.selected.fill(action.payload);
      break;
    case 'SORT_LAYERS': {
      let times;

      if (action.payload.newIndex > action.payload.oldIndex) {
        times = action.payload.newIndex - action.payload.oldIndex;
        Array(times).fill(0).map(() => {
          DrawTool.sides.selected.layers.bringForward.apply(DrawTool.sides.selected.layers, action.payload.items);
        });
      } else if (action.payload.newIndex < action.payload.oldIndex) {
        times = action.payload.oldIndex - action.payload.newIndex;
        Array(times).fill(0).map(() => {
          DrawTool.sides.selected.layers.sendBackwards.apply(DrawTool.sides.selected.layers, action.payload.items);
        });
      }
      break;
    }
    default:

  }
  return next(action);
};

import DrawTool from '../draw-tool/drawtool';

window.DrawTool = DrawTool;

const isSelectedSide = () => DrawTool.sides && DrawTool.sides.selected;

export default store => next => (action) => {
  const {
    activeBrush,
    brushOptions,
    textOptions,
    layersSelected,
    shapeColor,
    colorPickerColor,
  } = store.getState().drawTool;

  if (!isSelectedSide()) {
    return next(action);
  }

  if (!(action.type === 'UPDATE_LAYERS' || action.type === 'UNSELECT_ITEM' || action.type === 'EMPTY' || action.type === 'UPDATE_PRICE')) {
    DrawTool.sides.selected.items.finalizeBrush();
  }

  switch (action.type) {
    case 'SET_ACTIVE_TOOL':

      if (action.payload === 'panning') {
        DrawTool.sides.selected.drawingMode(false);
        DrawTool.sides.selected.panning = true;
      } else {
        DrawTool.sides.selected.panning = false;
      }

      if (action.payload === 'brush') {
        DrawTool.sides.selected.drawingMode(true);
        DrawTool.sides.selected.items[activeBrush](brushOptions);
        DrawTool.sides.selected.draw = true;
      } else {
        DrawTool.sides.selected.drawingMode(false);
      }
      break;
    case 'SELECT_BRUSH':
      DrawTool.sides.selected.items[action.payload](brushOptions);
      break;
    case 'SELECT_BRUSH_SIZE':
      DrawTool.sides.selected.items[activeBrush](Object.assign(brushOptions, { width: action.payload }));
      break;
    case 'SELECT_BRUSH_COLOR':
      DrawTool.sides.selected.items[activeBrush](Object.assign(brushOptions, { color: action.payload }));
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
      if (window.confirm('全てを削除しますか？')) {
        DrawTool.sides.selected.items.empty();
      }
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
      DrawTool.sides.selected.items.addSVG(`${action.payload}?_`, shapeColor);
      break;
    case 'INSERT_STICKER':
      DrawTool.sides.selected.items.addSVG(`${action.payload}?_`);
      break;
    case 'SELECT_SHAPE_COLOR':
      DrawTool.sides.selected.items.selected.fill(action.payload);
      break;
    case 'SORT_LAYERS': {
      DrawTool._evented = false;
      action.payload.items.forEach((el, index, arr) => {
        let sortIndex = arr.length - index - 1;
        DrawTool.sides.selected.layers.moveToIndex({ uuid: el.index, index: sortIndex });
      });
      setTimeout(() => {
        DrawTool._evented = true;
        DrawTool.trigger('history:update', { side: { id: DrawTool.sides.selected.id } });
      }, 100);
      break;
    }
    case 'TOGGLE_COLOR_PICKER':
      DrawTool.sides.selected.colorPicker.active = action.payload;
      break;
    case 'REMOVE_COLOR':
      DrawTool.sides.selected.items.selected.removeColor(colorPickerColor, 25);
      DrawTool.sides.selected.colorPicker.active = false;
      break;
    default:

  }
  return next(action);
};

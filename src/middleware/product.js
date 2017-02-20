import DrawTool from '../draw-tool/drawtool';
import escapeJSON from '../utils/escapeJSON';
import { uploadByString } from '../api/extras';
import { saveTemplate } from '../api/products';

import React from 'react';
import { connect } from 'redux'
import * as actions from '../actions/draw-tool';

export default store => next => (action) => {
  const { colors, colorSelected, sideSelected } = store.getState().product;

  switch (action.type) {
    case 'UPDATE_FONTS':
      action.payload.map(font => DrawTool.fontLoader(font.DrawerFont.title, font.DrawerFont.urls));
      break;
    case 'SELECT_COLOR': {
      DrawTool.sides.selected.items.finalizeBrush();

      //Change to promise
      setTimeout(() => {
        const data = colors.find(color => color.ProductColor.id === action.payload)
          .sides.map(side => JSON.parse(JSON.parse(escapeJSON(side.ProductColorSide.content))));

        DrawTool.importJSON(JSON.stringify(data));
        DrawTool.sides.select(JSON.parse(JSON.parse(escapeJSON(sideSelected.content))).id);
      }, 100);
      break;
    }
    case 'SELECT_SIDE': {
      const sideObj = colors.find(color => color.ProductColor.id === colorSelected.id).sides
        .find(side => side.ProductColorSide.id === action.payload).ProductColorSide;
      DrawTool.sides.select(JSON.parse(JSON.parse(escapeJSON(sideObj.content))).id);
      break;
    }
    case 'LOAD_PRODUCT': {
      if (action.payload.colors.length) {
        const color = action.payload.colors.find((c) => {
          return !!c.ProductColor.is_main;
        });

        const data = color.sides.map((side) => {
          return JSON.parse(JSON.parse(escapeJSON(side.ProductColorSide.content)));
        });

        DrawTool.importJSON(JSON.stringify(data)).then(() => {
          DrawTool.sides.select(
              JSON.parse(JSON.parse(escapeJSON(color.sides[0].ProductColorSide.content))).id
          );
          store.dispatch(actions.setLoading(false));
        });
      }
      break;
    }
    case 'LOAD_PRODUCT_WITH_DESIGN': {
      if (action.payload.product.colors.length) {
        const color = action.payload.product.colors.find((c) => {
          return c.ProductColor.id === action.payload.selected_color_id;
        });

        const data = color.sides.map((side) => {
          return JSON.parse(JSON.parse(escapeJSON(side.ProductColorSide.content)));
        });

        DrawTool.importJSON(JSON.stringify(data)).then(() => {
          DrawTool.sides._collection.forEach((side) => {
            side.fromJSON(action.payload.sides[side.id], () => {
              setTimeout(() => {
                store.dispatch(actions.updateLayers({
                  layers: DrawTool.sides.selected.layers.update().reverse(),
                  side: DrawTool.sides.selected.id,
                }));
                store.dispatch(actions.setLoading(false));
              });
            }, true);            
          });
        });

        DrawTool.sides.select(
          JSON.parse(JSON.parse(escapeJSON(color.sides[0].ProductColorSide.content))).id
        );
      }
      break;
    }
    case 'SAVE_TEMPLATE': {
      DrawTool.sides.selected.items.finalizeBrush();

      if (!DrawTool.sides.selected.layers.list.length) {
        alert('保存可能なデータはありません');
        break;
      }

      const imgB64 = DrawTool.sides.selected.getImagePreview();
      DrawTool.sides.selected.toSVG((svg) => {
        Promise.all([uploadByString('image/png', imgB64, 'png'), uploadByString('image/svg+xml', svg.split('\n').join(''), 'svg')]).then((values) => {
          saveTemplate(values[0], values[1]);
        });
      }, true);
      break;
    }

    case 'APPLY_TEMPLATE': {
      DrawTool.sides.selected.items.addImage(`${action.payload}?_`, true);
      break;
    }
    default:
      break;
  }
  return next(action);
};

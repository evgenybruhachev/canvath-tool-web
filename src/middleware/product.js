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
      action.payload.map(font => {
        if (navigator.appName == 'Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1)) {
          var style = document.createElement('style');
          style.type = "text/css";
          var fontFace = document.createTextNode(
            `@font-face {font-family: ${font.DrawerFont.name};
            src: url('${font.DrawerFont.urls.eot}');
            src: url('${font.DrawerFont.urls.eot}?#iefix') format('embedded-opentype'),
              url('${font.DrawerFont.urls.woff2}') format('woff2'),
              url('${font.DrawerFont.urls.woff}') format('woff'),
              url('${font.DrawerFont.urls.ttf}') format('truetype'),
              url('${font.DrawerFont.urls.svg}') format('svg');
            font-weight: normal;
            font-style: normal; }`
          );
          style.appendChild(fontFace);
          document.head.appendChild(style);
        } else {
          DrawTool.fontLoader(font.DrawerFont.name, font.DrawerFont.urls)
        }
      });
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
            if (action.payload.sides[side.id]) {
              if (action.payload.sides[side.id].startsWith('http')) {
                  side.items.addImage(`${action.payload.sides[side.id]}?_`);
                  store.dispatch(actions.setLoading(false));
              } else {
                side.fromJSON(action.payload.sides[side.id], () => {
                    setTimeout(() => {
                        store.dispatch(actions.updateLayers({
                            layers: DrawTool.sides.selected.layers.update().reverse(),
                            side: DrawTool.sides.selected.id,
                          }));
                        store.dispatch(actions.setActiveTool('pointer'));
                        store.dispatch(actions.setLoading(false));
                    });
                }, true);
              }
            }
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

      const toDataURL = url => fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
      }))

      const imgB64 = DrawTool.sides.selected.getImagePreview();
      DrawTool.sides.selected.toSVG((svg) => {
        if (svg.indexOf('xlink:href="http') < 0) {
          Promise.all([uploadByString('image/png', imgB64, 'png'), uploadByString('image/svg+xml', svg.split('\n').join(''), 'svg')]).then((values) => {
            saveTemplate(values[0], values[1]);
          });
        } else {
          let hrefs = svg.match(/xlink:href="http([^"]*)"/g);
          let hrefsB64 = [];
          for (let i = 0; i < hrefs.length; i++) {
            hrefs[i] = hrefs[i].replace('xlink:href="', '');
            hrefs[i] = hrefs[i].replace('"', '');
            hrefsB64.push(toDataURL(hrefs[i]));
          }
          Promise.all(hrefsB64).then(arr => {
            for (let i = 0; i < hrefs.length; i++) {
              svg = svg.replace(hrefs[i], arr[i]);
            }
            Promise.all([uploadByString('image/png', imgB64, 'png'), uploadByString('image/svg+xml', svg.split('\n').join(''), 'svg')]).then((values) => {
              saveTemplate(values[0], values[1]);
            });
          })
        }
      }, true);
      break;
    }

    case 'APPLY_TEMPLATE': {
      DrawTool.sides.selected.items.addImage(action.payload);
      break;
    }
    default:
      break;
  }
  return next(action);
};

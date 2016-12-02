import DrawTool from '../draw-tool/drawtool';
import escapeJSON from '../utils/escapeJSON';
import { uploadByString } from '../api/extras';
import { saveTemplate } from '../api/products';

export default store => next => (action) => {
  const { colors, colorSelected, sideSelected } = store.getState().product;

  switch (action.type) {
    case 'UPDATE_FONTS':
      action.payload.map(font => DrawTool.fontLoader(font.DrawerFont.title, font.DrawerFont.urls));
      break;
    case 'SELECT_COLOR': {
      DrawTool.sides.empty();
      colors.find(color => color.ProductColor.id === action.payload).sides.map((side) => {
        const sideProps = JSON.parse(JSON.parse(escapeJSON(side.ProductColorSide.content)));
        const fSide = DrawTool.sides.addSide(sideProps.id);
        return fSide.setImage(`${sideProps.imageUrl}?_`, sideProps.size)
          .then(() => {
            fSide.setBorder(sideProps.border);
            fSide.FabricCanvas.renderAll.bind(fSide.FabricCanvas);
            fSide.backdrop.opacity = 1;
            fSide.FabricCanvas.renderAll();
          });
      });
      DrawTool.sides.select(JSON.parse(JSON.parse(escapeJSON(sideSelected.content))).id);
      break;
    }
    case 'SELECT_SIDE': {
      const sideObj = colors.find(color => color.ProductColor.id === colorSelected.id).sides
        .find(side => side.ProductColorSide.id === action.payload).ProductColorSide;
      DrawTool.sides.select(JSON.parse(JSON.parse(escapeJSON(sideObj.content))).id);
      break;
    }
    case 'LOAD_PRODUCT': {
      if (action.payload.product.colors.length) {
        DrawTool.sides.empty();
        action.payload.product.colors[0].sides.map((side) => {
          const sideProps = JSON.parse(JSON.parse(escapeJSON(side.ProductColorSide.content)));
          const fSide = DrawTool.sides.addSide(sideProps.id);
          return fSide.setImage(`${sideProps.imageUrl}?_`, sideProps.size)
            .then(() => {
              fSide.setBorder(sideProps.border);
              fSide.FabricCanvas.renderAll.bind(fSide.FabricCanvas);
              fSide.backdrop.opacity = 1;
              fSide.FabricCanvas.renderAll();
            });
        });

        const color = action.payload.product.colors.find((color) => {
          return color.ProductColor.id === action.payload.colorId;
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
      });
      break;
    }

    case 'APPLY_TEMPLATE': {
      DrawTool.sides.selected.items.addImage(`${action.payload}?_`);
      break;
    }
    default:
      break;
  }
  return next(action);
};

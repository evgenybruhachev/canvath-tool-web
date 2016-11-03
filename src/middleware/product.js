import DrawTool from '../draw-tool/drawtool';
import escapeJSON from '../utils/escapeJSON';

export default store => next => (action) => {
  const { colors, colorSelected, sideSelected } = store.getState().product;

  switch (action.type) {
    case 'UPDATE_FONTS':
      action.payload.map(font => DrawTool.fontLoader(font.DrawerFont.title, font.DrawerFont.urls));
      break;
    case 'SELECT_COLOR':
      DrawTool.sides.empty();
      colors.find(color => color.ProductColor.id === action.payload).sides.map((side) => {
        let sideProps = JSON.parse(JSON.parse(escapeJSON(side.ProductColorSide.content)));
        let fSide = DrawTool.sides.addSide(sideProps.id);
        fSide.setImage(sideProps.imageUrl, sideProps.size)
          .then(() => {
            fSide.setBorder(sideProps.border);
            fSide.FabricCanvas.renderAll.bind(fSide.FabricCanvas);
          });
      });
      DrawTool.sides.select(sideSelected.title.toLowerCase());
      break;
    case 'SELECT_SIDE':
      let sideObj = colors.find(color => color.ProductColor.id === colorSelected.id).sides
        .find(side => side.ProductColorSide.id === action.payload).ProductColorSide;
      DrawTool.sides.select(sideObj.title.toLowerCase());
      break;
    case 'LOAD_PRODUCT':
      if(action.payload.colors.length){
        action.payload.colors[0].sides.map((side) => {
          let sideProps = JSON.parse(JSON.parse(escapeJSON(side.ProductColorSide.content)));
          let fSide = DrawTool.sides.addSide(sideProps.id);
          fSide.setImage(sideProps.imageUrl, sideProps.size)
            .then(() => {
              fSide.setBorder(sideProps.border);
              fSide.FabricCanvas.renderAll.bind(fSide.FabricCanvas);
            });
        })
        DrawTool.sides.select(action.payload.colors[0].sides[0].ProductColorSide.title.toLowerCase())
      }
      break;
    default:
      break;
  }
  return next(action);
};

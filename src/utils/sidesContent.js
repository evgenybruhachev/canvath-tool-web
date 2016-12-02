const sidesContent = {

  data: {},

  getContent(sides) {
    sides.forEach((side) => {
      side.items.finalizeBrush();
      this.data[side.id] = side.toJSON();
    });
  },

  applyContent(side) {
    if (!this.data[side.id]) {
      return false;
    }
    // const data = JSON.parse(this.data[side.id]);
    // data.canvas.backgroundImage = side.FabricCanvas.backgroundImage;
    //
    // console.log(canvas);

    side.fromJSON(this.data[side.id]);
  },

};

export default sidesContent;

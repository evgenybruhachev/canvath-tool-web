import { combineReducers } from 'redux';
import product from './product';
import drawTool from './draw-tool';

export default combineReducers({
  product,
  drawTool,
});

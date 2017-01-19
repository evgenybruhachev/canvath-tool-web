import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { WEBHOST } from '../../constants';

import DrawTool from '../../draw-tool/drawtool';

import * as ProductActions from '../../actions/product';
import * as DrawToolActions from '../../actions/draw-tool';

import Button from '../../components/button';

import { saveProduct } from '../../api/products';

class HeaderMobile extends Component {

  static propTypes = {
    activeTool: React.PropTypes.string,
    dispatch: React.PropTypes.func,
    selected: React.PropTypes.object,
    history: React.PropTypes.object,
    price: React.PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.toggleActiveTool = this.toggleActiveTool.bind(this);
    this.showMobileNav = this.showMobileNav.bind(this);
    this.goToCart = this.goToCart.bind(this);
  }

  toggleActiveTool(tool) {
    const { dispatch } = this.props;
    dispatch(DrawToolActions.setActiveTool(tool));
  }

  showMobileNav() {
    const { dispatch } = this.props;
    dispatch(ProductActions.toggleMobileNavigation(true));
    document.body.classList.add('fixed');
  }

  undo() {
    const { dispatch } = this.props;
    dispatch(DrawToolActions.undo(DrawTool.history.history[DrawTool.sides.selected.id]));
    this.forceUpdate();
  }

  redo() {
    const { dispatch } = this.props;
    dispatch(DrawToolActions.redo(DrawTool.history.history[DrawTool.sides.selected.id]));
    this.forceUpdate();
  }

  goToCart() {
    const { dispatch, colorSelected } = this.props;
    const sides = {};

    dispatch(DrawToolActions.setLoading(true));

    dispatch(DrawToolActions.setActiveTool('pointer'));

    setTimeout(() => {

      DrawTool.sides._collection.forEach((side) => {
        sides[side.id] = { content: side.toJSON() };
      });

      saveProduct(colorSelected.id, sides).then((data) => {
        const form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', WEBHOST + '/proc.php?run=appli2web');

        for (const key in data) {
          const input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('value', data[key]);
          input.setAttribute('name', key);
          input.setAttribute('id', key);
          form.appendChild(input);
        }

        form.submit();
      });

    }, 500);
  }

  render() {
    const { activeTool, dispatch, selected, history, price } = this.props;

    return (
      <div className="app-header">
        <Button icon="hamburger" className="blue hamburger-button" onClick={this.showMobileNav} />
        <Button icon="zoom-in" label="拡大" className="blue" onClick={() => dispatch(DrawToolActions.zoomIn())} />
        <Button icon="zoom-out" label="縮小" className="blue" onClick={() => dispatch(DrawToolActions.zoomOut())} />
        <Button icon="undo" label="戻る" className="blue" disabled={activeTool === 'brush' || history.currentIndex === 0} onClick={this.undo} />
        <Button icon="redo" label="進む" className="blue" disabled={activeTool === 'brush' || history.currentIndex + 1 === history.collection.length} onClick={this.redo} />
        <Button
          icon="trash"
          label={'削除'}
          className="blue"
          active={activeTool === 'eraser'}
          onClick={() => dispatch(DrawToolActions.remove())}
          disabled={!selected}
        />
        <Button label={<span>レジへ進む<br />{price}円</span>} className="cart-button" onClick={this.goToCart} />
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    activeTool: state.drawTool.activeTool,
    selected: state.drawTool.selected,
    history: state.drawTool.history,
    colorSelected: state.product.colorSelected,
    price: state.product.price,
  };
}

export default connect(
  mapStateToProps
)(HeaderMobile);

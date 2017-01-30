import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Button from '../../components/button';
import DropDown from '../../components/drop-down';
import DropDownColors from '../../components/drop-down-colors';

import DrawTool from '../../draw-tool/drawtool';

import { getTemplates, saveProduct } from '../../api/products';

import * as ProductActions from '../../actions/product';
import * as DrawToolActions from '../../actions/draw-tool';

import { WEBHOST } from '../../constants';
import query from '../../constants/query';

class Header extends Component {

  static propTypes = {
    product: React.PropTypes.object,
    colors: React.PropTypes.array,
    colorSelected: React.PropTypes.object,
    sideSelected: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    price: React.PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.openProductLoad = this.openProductLoad.bind(this);
    this.openCategorySelect = this.openCategorySelect.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.selectSide = this.selectSide.bind(this);
    this.handleSaveTemplate = this.handleSaveTemplate.bind(this);
    this.goToCart = this.goToCart.bind(this);
  }

  openProductLoad() {
    const { dispatch } = this.props;
    getTemplates().then(data => dispatch(ProductActions.updateTemplates(data)));
    dispatch(ProductActions.toggleLoadProductContainer(true));
  }

  openCategorySelect() {
    const { dispatch } = this.props;
    dispatch(ProductActions.toggleLoadProductCategoryContainer(true));
  }

  selectColor(id) {
    const { dispatch } = this.props;
    dispatch(ProductActions.selectColor(id));
  }

  selectSide(id) {
    const { dispatch } = this.props;
    dispatch(ProductActions.selectSide(id));
  }

  handleSaveTemplate() {
    const { dispatch } = this.props;
    dispatch(DrawToolActions.setActiveTool('pointer'));

    if(query.session === ''){
        alert("noboriに無料新規会員登録いただければ画像の保存と読み込み画像の可能になります");
    } else {
        setTimeout(() => dispatch(ProductActions.saveTemplate()), 500);
    }
  }

  goToCart() {
    const { dispatch, colorSelected } = this.props;
    const sides = {};

    dispatch(DrawToolActions.setActiveTool('pointer'));

    dispatch(DrawToolActions.setLoading(true));

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
    const { colors, colorSelected, sideSelected, product, price } = this.props;

    return (
      <div className="app-header">
        <img src="assets/img/logo.png" alt="Nobori" className="logo" />
        <Button icon="poster" label="画像開く" onClick={this.openProductLoad} />
        <Button icon="save" label="画像保存" onClick={this.handleSaveTemplate} />
        <DropDown label={product ? product.title : 'アイテム変更'} style={{ width: '200px' }} onClick={this.openCategorySelect} />
        {/*<DropDownColors*/}
          {/*label={colorSelected ? <div className="list-item">*/}
            {/*<span className="color" style={{ backgroundColor: colorSelected.value }} /> {colorSelected.title}*/}
          {/*</div> : 'Color'*/}
          {/*}*/}
          {/*onChange={this.selectColor}*/}
          {/*selected={colorSelected || {title: 'none', value: '#ffffff'}}*/}
        {/*>*/}
          {/*{*/}
            {/*colors && colors.map((color, index) => <div*/}
              {/*className={classNames('list-item', { 'active': color.ProductColor.id === colorSelected.id })}*/}
              {/*key={index}*/}
              {/*data-meta={color.ProductColor.id}*/}
              {/*style={{ backgroundColor: color.ProductColor.value }}*/}

            {/*/>)*/}
          {/*}*/}
        {/*</DropDownColors>*/}

        <DropDown
            label={colorSelected ? <div className="list-item">
              <span className="color" style={{ backgroundColor: colorSelected.value }} /> {colorSelected.title}
            </div> : 'Color'
            }
            onChange={this.selectColor}
            selected={colorSelected || {title: 'none', value: '#ffffff'}}
        >
            {
                colors && colors.map((color, index) => <div className="list-item" key={index} data-meta={color.ProductColor.id}>
                      <span className="color" style={{ backgroundColor: color.ProductColor.value }} />
                        {color.ProductColor.title}
                    </div>
                )
            }
        </DropDown>

        <DropDown
          label={
            sideSelected ? <div className="list-item">{sideSelected.title}</div> : 'Side'
          }
          onChange={this.selectSide}
        >
          {colors && colors.find(color => color.ProductColor.id === colorSelected.id).sides.map((side, index) => <div className="list-item" key={index} data-meta={side.ProductColorSide.id}>{side.ProductColorSide.title}</div>)}
        </DropDown>
        <Button label={<span>レジへ進む<br />{price}円</span>} className="cart-button" onClick={this.goToCart} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    product: state.product.product,
    colors: state.product.colors,
    colorSelected: state.product.colorSelected,
    sideSelected: state.product.sideSelected,
    price: state.product.price,
  };
}

export default connect(
  mapStateToProps
)(Header);

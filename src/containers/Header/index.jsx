import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/button';
import DropDown from '../../components/drop-down';

import { getTemplates } from '../../api/products';

import * as ProductActions from '../../actions/product';

class Header extends Component {

  static propTypes = {
    product: React.PropTypes.object,
    colors: React.PropTypes.array,
    colorSelected: React.PropTypes.object,
    sideSelected: React.PropTypes.object,
    dispatch: React.PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.openProductLoad = this.openProductLoad.bind(this);
    this.openCategorySelect = this.openCategorySelect.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.selectSide = this.selectSide.bind(this);
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
  render() {
    const { colors, colorSelected, sideSelected, product, dispatch } = this.props;

    return (
      <div className="app-header">
        <img src="assets/img/logo.png" alt="Nobori" className="logo" />
        <Button icon="poster" label="開く" onClick={this.openProductLoad} />
        <Button icon="save" label="開く" onClick={() => dispatch(ProductActions.saveTemplate())} />
        <DropDown label={product ? product.title : 'Type'} style={{ width: '200px' }} onClick={this.openCategorySelect} />
        <DropDown
          label={colorSelected ? <div className="list-item">
            <span className="color" style={{ backgroundColor: colorSelected.value }} /> {colorSelected.title}
          </div> : 'Color'
          }
          onChange={this.selectColor}
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
        <Button icon="cart" label="5000" className="cart-button" />
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
  };
}

export default connect(
  mapStateToProps
)(Header);

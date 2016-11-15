import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { getTemplates } from '../../api/products';

import * as ProductActions from '../../actions/product';
import * as DrawToolActions from '../../actions/draw-tool';

import Button from '../../components/button';
import Icon from '../../components/icon';
import DropDown from '../../components/drop-down';

class MobileNavigation extends Component {

  static propTypes = {
    mobileNavigation: React.PropTypes.bool,
    product: React.PropTypes.object,
    colors: React.PropTypes.array,
    colorSelected: React.PropTypes.object,
    sideSelected: React.PropTypes.object,
    activeTool: React.PropTypes.string,
    dispatch: React.PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.hideMobileNav = this.hideMobileNav.bind(this);
    this.openProductLoad = this.openProductLoad.bind(this);
    this.openCategorySelect = this.openCategorySelect.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.selectSide = this.selectSide.bind(this);
    this.handleSaveTemplate = this.handleSaveTemplate.bind(this);
  }

  hideMobileNav() {
    const { dispatch } = this.props;
    dispatch(ProductActions.toggleMobileNavigation(false));
    document.body.classList.remove('fixed');
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

    setTimeout(() => dispatch(ProductActions.saveTemplate()), 500);
  }

  render() {
    const { mobileNavigation, colors, colorSelected, sideSelected, product, activeTool, dispatch } = this.props;

    return (
      <div className={classNames('mobile-navigation', { active: mobileNavigation })}>
        <div className="head">
          <div className="aside" />
          <img src="assets/img/logo-s.png" alt="Nobori" className="logo" />
          <div className="aside">
            <Button className="flat-button" icon={'close'} onClick={this.hideMobileNav} />
          </div>
        </div>
        <div className="content">
          <button className="btn" onClick={this.openProductLoad}>
            <Icon icon={'poster'} />
            <span className="label">画像開く</span>
          </button>
          <button className="btn" onClick={this.handleSaveTemplate}>
            <Icon icon={'save'} />
            <span className="label">画像保存</span>
          </button>

          <div>
            <DropDown onClick={this.openCategorySelect} label={product ? product.title : 'Type'} />

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
          </div>

          <button className="btn" onClick={() => dispatch(DrawToolActions.empty())}>
            <span className="label">全削除</span>
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    mobileNavigation: state.product.mobileNavigation,
    product: state.product.product,
    colors: state.product.colors,
    colorSelected: state.product.colorSelected,
    sideSelected: state.product.sideSelected,
    activeTool: state.drawTool.activeTool,
  };
}

export default connect(
  mapStateToProps
)(MobileNavigation);

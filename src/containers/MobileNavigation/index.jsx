import React, { Component } from 'react';
import { connect } from 'react-redux';
import { parse } from 'querystring';
import classNames from 'classnames';

import DrawTool from '../../draw-tool/drawtool';

import { getTemplates } from '../../api/products';

import * as ProductActions from '../../actions/product';
import * as DrawToolActions from '../../actions/draw-tool';

import Button from '../../components/button';
import Icon from '../../components/icon';
import DropDown from '../../components/drop-down';
import query from '../../constants/query';

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

    this.state = {
      sessionToken: null
    };

    this.changCountColor = this.changCountColor.bind(this);
    this.downloadColorLayers = this.downloadColorLayers.bind(this);
    this.hideMobileNav = this.hideMobileNav.bind(this);
    this.openProductLoad = this.openProductLoad.bind(this);
    this.openCategorySelect = this.openCategorySelect.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.selectSide = this.selectSide.bind(this);
    this.handleSaveTemplate = this.handleSaveTemplate.bind(this);
    this.getSessionParse = this.getSessionParse.bind(this);

    this.numberOfColors = 0;
    this.maxColorCount = 0;

    DrawTool.on('layers:update', () => {
      DrawTool.sides.selected.getCountColors(this.maxColorCount).then((colors) => {
        this.numberOfColors = colors.count;
        this.forceUpdate();
      });
    });
  }

  downloadColorLayers() {
    DrawTool.sides.selected.getPreviewForLayers().then((layers) => {
      Array.prototype.forEach.call(layers, (layer, i) => {
        var link = document.createElement('a');
        link.href = layer.data;
        link.target = '_tab';
        link.download = 'layer-' + i +'.png';
        link.click();
      });
    });
  }

  changCountColor(evt) {
    this.maxColorCount = evt.target.value;
    DrawTool.sides.selected.getCountColors(this.maxColorCount).then((colors) => {
      this.numberOfColors = colors.count;
      this.forceUpdate();
    });
  }

  // get session token from query string
  getSessionParse () {
    let getSessionToken = (queryString) => {
      let queryParams = parse(queryString);
      for (let key in queryParams) {
        if (key.indexOf('session') !== -1) {
          return queryParams[key];
        }
      }
    };
    let sessionToken = getSessionToken(window.location.hash);
    if (!sessionToken) {
      sessionToken = getSessionToken(window.location.search);
    }
    this.setState({ sessionToken: sessionToken });
  }

  componentDidMount(){
    this.getSessionParse()
  }
  // ...

  hideMobileNav() {
    const { dispatch } = this.props;
    dispatch(ProductActions.toggleMobileNavigation(false));
    document.body.classList.remove('fixed');
  }

  openProductLoad() {
    const { dispatch } = this.props;
    getTemplates().then(data => dispatch(ProductActions.updateTemplates(data)));

    if (!this.state.sessionToken) {
      setTimeout(() => alert("noboriに無料新規会員登録いただければ画像の保存と読み込み画像の可能になります"), 500);
    } else {
      setTimeout(() => dispatch(ProductActions.toggleLoadProductContainer(true)), 500);
    }
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

    if (!this.state.sessionToken) {
      setTimeout(() => alert("noboriに無料新規会員登録いただければ画像の保存と読み込み画像の可能になります"), 500);
    } else {
      setTimeout(() => dispatch(ProductActions.saveTemplate()), 500);
    }
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

          <button className="btn" onClick={() => dispatch(DrawToolActions.empty())}>
            <span className="label">全削除</span>
          </button>
        </div>
        <div className="colors-number">
          Number of colors: <span>{this.numberOfColors}</span>
          <div>Max count: <input type="number" value={this.maxColorCount} onChange={this.changCountColor}/></div>
        </div>
        <Button label="DCL" className="cart-button dcl-button" onClick={this.downloadColorLayers} />
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

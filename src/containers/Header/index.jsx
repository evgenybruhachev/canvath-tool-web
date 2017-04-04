import React, { Component } from 'react';
import { connect } from 'react-redux';
import { parse } from 'querystring';
import classNames from 'classnames';

import Button from '../../components/button';
import DropDown from '../../components/drop-down';
import DropDownColors from '../../components/drop-down-colors';

import DrawTool from '../../draw-tool/drawtool';

import { getTemplates, saveProduct } from '../../api/products';

import * as ProductActions from '../../actions/product';
import * as DrawToolActions from '../../actions/draw-tool';
import * as actions from '../../actions/draw-tool';

import { WEBHOST } from '../../constants';
import query from '../../constants/query';

import disableOnBeforeUnload from '../../utils/onbeforeunload';

class Header extends Component {

  static propTypes = {
    product: React.PropTypes.object,
    colors: React.PropTypes.array,
    colorSelected: React.PropTypes.object,
    sideSelected: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    price: React.PropTypes.number,
    layers: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      sessionToken: null
    };

    this.openProductLoad = this.openProductLoad.bind(this);
    this.openCategorySelect = this.openCategorySelect.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.selectSide = this.selectSide.bind(this);
    this.handleSaveTemplate = this.handleSaveTemplate.bind(this);
    this.goToCart = this.goToCart.bind(this);
    this.getSessionParse = this.getSessionParse.bind(this);
    this.goToMainSite = this.goToMainSite.bind(this);
    this.ifLayersEmpty = this.ifLayersEmpty.bind(this);
  }

  openProductLoad() {
    const { dispatch } = this.props;
    getTemplates().then(data => dispatch(ProductActions.updateTemplates(data)));

    if (!this.state.sessionToken || !query.login_type || query.login_type != "user") {
      setTimeout(() => alert("Up-Tに無料会員登録をいただければ、画像の保存と読み込みが可能になります。"), 500);
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

    if(DrawTool.sides.selected.draw === true){
        setTimeout(() => dispatch(actions.setActiveTool('brush')), 500);
    }
  }

  selectSide(id) {
    const { dispatch } = this.props;
    dispatch(ProductActions.selectSide(id));
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


  handleSaveTemplate() {
    const {dispatch} = this.props;
    dispatch(DrawToolActions.setActiveTool('pointer'));

    if (!this.state.sessionToken || !query.login_type || query.login_type != "user") {
      setTimeout(() => alert("Up-Tに無料会員登録をいただければ、画像の保存と読み込みが可能になります。"), 500);
    } else {
      setTimeout(() => dispatch(ProductActions.saveTemplate()), 500);
    }
  }

  goToCart() {
    const { dispatch, colorSelected } = this.props;
    const sides = {};

    if (this.ifLayersEmpty()) {
      setTimeout(() => {
        window.alert('デザインなしの商品は追加できません');
      }, 500);
    } else {
      disableOnBeforeUnload();

      dispatch(DrawToolActions.setActiveTool('pointer'));

    dispatch(DrawToolActions.setLoading(true));

    setTimeout(() => {
      DrawTool.sides._collection.forEach((side) => {
          let contentObject = side.toObject();
          if (contentObject.canvas.objects.length > 0) {
              sides[side.id] = { content: side.toJSON() };
          }
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

        query.setData(parse(window.location.search.substring(1)));

        if (query.cart_id) {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('value', query.cart_id);
            input.setAttribute('name', 'cart_id');
            input.setAttribute('id', 'cart_id');
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
      });

      }, 500);
    }
  }

  goToMainSite() {
    window.location.href = WEBHOST;
  }

  ifLayersEmpty() {
    for (let variable in this.props.layers) {
      if (this.props.layers.hasOwnProperty(variable) && this.props.layers[variable].length !== 0) {
        return false
      }
    }
    return true;
  }

  render() {
    const { colors, colorSelected, sideSelected, product, price, layers } = this.props;

    return (
      <div className="app-header">
        <img src="assets/img/logo.png" alt="UP-T" className="logo" onClick={this.goToMainSite} />
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
        <Button label={<span>レジへ進む<br />{price}円</span>} className="cart-button" onClick={this.goToCart}/>
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
    layers: state.drawTool.layers,
  };
}

export default connect(
  mapStateToProps
)(Header);

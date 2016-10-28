import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as ProductActions from '../../actions/product';

import FlatButton from '../../components/flat-button'
import Icon from '../../components/icon'
import DropDown from '../../components/drop-down'

class MobileNavigation extends Component{

  componentDidMount() {
    document.body.classList.add('fixed');
  }

  componentWillUnmount() {
    document.body.classList.remove('fixed');
  }

  _hideMobileNav(){
    this.props.actions.toggle_mobile_navigation(false)
  }

  _openProductLoad(){
    this.props.actions.toggle_load_product_container(true);
  }

  _openCategorySelect(){
    this.props.actions.toggle_load_product_category_container(true);
  }

  render(){

    const {mobile_navigation} = this.props;

    return (
      <div className={classNames('mobile-navigation', {'active': mobile_navigation})}>
        <div className="head">
          <div className="aside"></div>
          <img src="assets/img/logo-s.png" alt="Nobori" className='logo'/>
          <div className="aside">
            <FlatButton icon={'close'} onClick={this._hideMobileNav.bind(this)}/>
          </div>
        </div>
        <div className="content">
          <button className="btn" onClick={this._openProductLoad.bind(this)}>
            <Icon icon={'poster'} />
            <span className="label">開く</span>
          </button>

          <div>
            <DropDown label='Type' onClick={this._openCategorySelect.bind(this)}/>

            <DropDown label='Side'>
              <div className="list-item">Side 1</div>
              <div className="list-item">Side 2</div>
              <div className="list-item">Side 3</div>
            </DropDown>

            <DropDown label='Color'>
              <div className="list-item"><span className="color" style={{'backgroundColor': 'red'}}></span>Red</div>
              <div className="list-item"><span className="color" style={{'backgroundColor': 'blue'}}></span>Blue</div>
              <div className="list-item"><span className="color" style={{'backgroundColor': 'green'}}></span>Green</div>
            </DropDown>
          </div>

          <button className="btn">
            <Icon icon={'save'} />
            <span className="label">保存</span>
          </button>
          <button className="btn">
            <span className="label">全削除</span>
          </button>
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    mobile_navigation: state.product.mobile_navigation
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProductActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileNavigation);


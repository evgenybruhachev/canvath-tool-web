import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as ProductActions from '../../actions/product';

import Button from '../../components/button';
import Icon from '../../components/icon';
import DropDown from '../../components/drop-down';

class MobileNavigation extends Component {

  static propTypes = {
    actions: React.PropTypes.object,
    mobileNavigation: React.PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.hideMobileNav = this.hideMobileNav.bind(this);
    this.openProductLoad = this.openProductLoad.bind(this);
    this.openCategorySelect = this.openCategorySelect.bind(this);
  }

  hideMobileNav() {
    this.props.actions.toggleMobileNavigation(false);
    document.body.classList.remove('fixed');
  }

  openProductLoad() {
    this.props.actions.toggleLoadProductContainer(true);
  }

  openCategorySelect() {
    this.props.actions.toggleLoadProductCategoryContainer(true);
  }

  render() {
    const { mobileNavigation } = this.props;

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
            <span className="label">開く</span>
          </button>
          <button className="btn">
            <Icon icon={'save'} />
            <span className="label">保存</span>
          </button>

          <div>
            <DropDown label="Type" onClick={this.openCategorySelect} />

            <DropDown label="Color">
              <div className="list-item"><span className="color" style={{ backgroundColor: 'red' }} />Red</div>
              <div className="list-item"><span className="color" style={{ backgroundColor: 'blue' }} />Blue</div>
              <div className="list-item"><span className="color" style={{ backgroundColor: 'green' }} />Green</div>
            </DropDown>

            <DropDown label="Side">
              <div className="list-item">Side 1</div>
              <div className="list-item">Side 2</div>
              <div className="list-item">Side 3</div>
            </DropDown>
          </div>

          <button className="btn">
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProductActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileNavigation);

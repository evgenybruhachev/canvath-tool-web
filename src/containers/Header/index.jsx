import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '../../components/button';
import DropDown from '../../components/drop-down';

import * as ProductActions from '../../actions/product';

class Header extends Component {

  static propTypes = {
    actions: React.PropTypes.obj,
  }

  constructor(props) {
    super(props);

    this.openProductLoad = this.openProductLoad.bind(this);
    this.openCategorySelect = this.openCategorySelect.bind(this);
  }

  openProductLoad() {
    this.props.actions.toggleLoadProductContainer(true);
  }

  openCategorySelect() {
    this.props.actions.toggleLoadProductCategoryContainer(true);
  }

  render() {
    return (
      <div className="app-header">
        <img src="assets/img/logo.png" alt="Nobori" className="logo" />
        <Button icon="poster" label="開く" onClick={this.openProductLoad} />
        <Button icon="save" label="開く" />
        <DropDown label="Type" style={{ width: '200px' }} onClick={this.openCategorySelect} />
        <DropDown label="Side">
          <div className="list-item">Side 1</div>
          <div className="list-item">Side 2</div>
          <div className="list-item">Side 3</div>
        </DropDown>
        <DropDown label="Color">
          <div className="list-item"><span className="color" style={{ backgroundColor: 'red' }} />Red</div>
          <div className="list-item"><span className="color" style={{ backgroundColor: 'blue' }} />Blue</div>
          <div className="list-item"><span className="color" style={{ backgroundColor: 'green' }} />Green</div>
        </DropDown>
        <Button icon="cart" label="5000" className="cart-button" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loadProductContainer: state.product.loadProductContainer,
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
)(Header);

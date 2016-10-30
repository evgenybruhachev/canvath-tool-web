import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ProductActions from '../../actions/product';
import * as DrawToolActions from '../../actions/draw-tool';

import Button from '../../components/button';

class HeaderMobile extends Component {

  static propTypes = {
    actions: React.PropTypes.obj,
    activeTool: React.PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.toggleActiveTool = this.toggleActiveTool.bind(this);
    this.showMobileNav = this.showMobileNav.bind(this);
  }

  toggleActiveTool(tool) {
    this.props.actions.drawToolActions.setActiveTool(tool);
  }

  showMobileNav() {
    this.props.actions.productActions.toggleMobileNavigation(true);
    document.body.classList.add('fixed');
  }

  render() {
    const { activeTool } = this.props;

    return (
      <div className="app-header">
        <Button icon="hamburger" className="blue" onClick={this.showMobileNav} />
        <Button icon="zoom-in" label="Zoom In" className="blue" />
        <Button icon="zoom-out" label="Zoom Out" className="blue" />
        <Button icon="undo" label="Undo" className="blue" />
        <Button icon="redo" label="Redo" className="blue" />
        <Button
          icon="trash"
          label={'削除'}
          className="blue"
          onClick={() => this.toggleActiveTool('eraser')}
          active={activeTool === 'eraser'}
        />
        <Button icon="cart" label="5000" className="cart-button" />
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    activeTool: state.drawTool.activeTool,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      productActions: bindActionCreators(ProductActions, dispatch),
      drawToolActions: bindActionCreators(DrawToolActions, dispatch),
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderMobile);

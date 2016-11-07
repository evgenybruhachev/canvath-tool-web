import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ProductActions from '../../actions/product';
import * as DrawToolActions from '../../actions/draw-tool';

import Button from '../../components/button';

class HeaderMobile extends Component {

  static propTypes = {
    activeTool: React.PropTypes.string,
    dispatch: React.PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.toggleActiveTool = this.toggleActiveTool.bind(this);
    this.showMobileNav = this.showMobileNav.bind(this);
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

  render() {
    const { activeTool, dispatch } = this.props;

    return (
      <div className="app-header">
        <Button icon="hamburger" className="blue" onClick={this.showMobileNav} />
        <Button icon="zoom-in" label="Zoom In" className="blue" onClick={() => dispatch(DrawToolActions.zoomIn())} />
        <Button icon="zoom-out" label="Zoom Out" className="blue" onClick={() => dispatch(DrawToolActions.zoomOut())} />
        <Button icon="undo" label="Undo" className="blue" disabled={activeTool === 'brush'} onClick={() => dispatch(DrawToolActions.undo())} />
        <Button icon="redo" label="Redo" className="blue" disabled={activeTool === 'brush'} onClick={() => dispatch(DrawToolActions.redo())} />
        <Button
          icon="trash"
          label={'削除'}
          className="blue"
          active={activeTool === 'eraser'}
          onClick={() => dispatch(DrawToolActions.remove())}
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

export default connect(
  mapStateToProps
)(HeaderMobile);

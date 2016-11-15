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
    const { activeTool, dispatch, selected } = this.props;

    return (
      <div className="app-header">
        <Button icon="hamburger" className="blue" onClick={this.showMobileNav} />
        <Button icon="zoom-in" label="拡大" className="blue" onClick={() => dispatch(DrawToolActions.zoomIn())} />
        <Button icon="zoom-out" label="縮小" className="blue" onClick={() => dispatch(DrawToolActions.zoomOut())} />
        <Button icon="undo" label="戻る" className="blue" disabled={activeTool === 'brush'} onClick={() => dispatch(DrawToolActions.undo())} />
        <Button icon="redo" label="進む" className="blue" disabled={activeTool === 'brush'} onClick={() => dispatch(DrawToolActions.redo())} />
        <Button
          icon="trash"
          label={'削除'}
          className="blue"
          active={activeTool === 'eraser'}
          onClick={() => dispatch(DrawToolActions.remove())}
          disabled={!selected}
        />
        <Button label={<span>レジへ進む<br />5000円</span>} className="cart-button" />
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    activeTool: state.drawTool.activeTool,
    selected: state.drawTool.selected,
  };
}

export default connect(
  mapStateToProps
)(HeaderMobile);

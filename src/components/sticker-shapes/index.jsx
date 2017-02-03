import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as actions from '../../actions/draw-tool';

class StickerShape extends Component {

  static propTypes = {
    path: React.PropTypes.string,
    onClick: React.PropTypes.func,
    dispatch: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.getSvgFunc = this.getSvgFunc.bind(this);
    this.getSvgFunc(props.path);

    this.state = {
        svgElement: this.getSvgFunc(props.path)
    };
  }

  handleOnClick() {
    this.props.onClick(this.props.path);
  }

  getSvgFunc( url ) {

      const { dispatch } = this.props;

      let req = null;
      try { req = new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {
          try { req = new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {
              try { req = new XMLHttpRequest(); } catch(e) {}
          }
      }
      if (req == null) throw new Error('XMLHttpRequest not supported');

      req.open("GET", url, false);

      req.onreadystatechange = () => {
          if (req.readyState == XMLHttpRequest.DONE) {
              dispatch(actions.stickerShapeSvgLoad(url));
              setTimeout(() => $(this.refs['stickerShapeItem']).find('svg').css('fill', this.props.color))
          }
      };

      req.send(null);
      req = req.responseText;

      function createMarkup() {
          return {__html: req};
      }
      function MyComponent() {
          return <div dangerouslySetInnerHTML={createMarkup()} />;
      }
      return MyComponent();
  }

  componentWillReceiveProps(nextProps){
      if(nextProps.path !== this.props.path){
          this.setState({
              svgElement: this.getSvgFunc(nextProps.path)
          })
      }
      if(nextProps.color !== this.props.color) {
          $(this.refs['stickerShapeItem']).find('svg').css('fill', nextProps.color)
      }
  }

  render() {
    return (
      <div ref='stickerShapeItem'
        className={classNames('sticker')}
        onClick={this.handleOnClick}
      >
          {this.state.svgElement}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    test: true
  };
}

export default connect(
  mapStateToProps
)(StickerShape);


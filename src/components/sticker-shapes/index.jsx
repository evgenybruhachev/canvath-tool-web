import React, { Component } from 'react';
import classNames from 'classnames';

class StickerShape extends Component {

  static propTypes = {
    path: React.PropTypes.string,
    onClick: React.PropTypes.func,
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
              setTimeout(() => $(this.refs['dhilt']).find('svg').css('fill', this.props.color))
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
          $(this.refs['dhilt']).find('svg').css('fill', nextProps.color)
      }
  }

  render() {
    return (
      <div ref='dhilt'
        className={classNames('sticker')}
        onClick={this.handleOnClick}
      >
          {this.state.svgElement}
      </div>
    );
  }
}

export default StickerShape;

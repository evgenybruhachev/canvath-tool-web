import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import FlatButton from '../flat-button';

class ProductLoad extends Component {

  static propTypes = {
    children: React.PropTypes.arr,
    close: React.PropTypes.func,
    title: React.PropTypes.string,
    back: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', this.hide, true);
    document.body.classList.add('fixed');
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.hide, true);
    document.body.classList.remove('fixed');
  }

  hide(e) {
    if (e.keyCode === 27) {
      this.props.close();
    }
  }

  render() {
    const { close, title, back } = this.props;

    return (
      <div className="product-load">
        <div className="head">
          <div className="aside">
            <MediaQuery query="(min-width: 769px)">
              {back && <FlatButton icon={'back'} label={'back'} onClick={back} />}
            </MediaQuery>
            <MediaQuery query="(max-width: 768px)">
              {back && <FlatButton icon={'back-m'} label={'back'} onClick={back} />}
            </MediaQuery>
          </div>
          <div className="title">{title}</div>
          <div className="aside">
            <FlatButton icon={'close'} label={'esc'} onClick={close} />
          </div>
        </div>

        <div className="content">{this.props.children}</div>
      </div>
    );
  }
}

export default ProductLoad;

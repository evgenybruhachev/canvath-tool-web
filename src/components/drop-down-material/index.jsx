import React, { Component } from 'react';
import classNames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';

class DropDownMaterial extends Component {

  static propTypes = {
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    className: React.PropTypes.string,
    elements: React.PropTypes.array,
    onChange: React.PropTypes.func,
    style: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      value: null,
      selectValue: "日本語",
      selectValueBrush: "20pt",
      mobile: window.matchMedia('(max-width: 1079px)').matches,
    };

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openList = this.openList.bind(this);
    this.getElementsOptions = this.getElementsOptions.bind(this);
    this.select = this.select.bind(this);
  }

  handleChange(event) {
    if(this.props.className === 'brushSize'){
      this.setState({selectValueBrush: event.target.value});
      if (this.props.onChange)
        this.props.onChange(event.target.value.slice(0,-2));
    } else {
      this.setState({selectValue: event.target.value});
      if (this.props.onChange)
        this.props.onChange(event.target.value);
    }

  }

  getElementsOptions () {
    let elementsArr = this.props.elements;
    if(this.props.className === 'brushSize'){
      return elementsArr.map(function (element,i) {
        return <option
          key={i}
          value={element.val + "pt"}>
          {element.val + "pt"}
        </option>
      });
    } else if (this.props.className === 'fonts') {
      return elementsArr.map(function (element,i) {
        if (element.loaded) {
          return <option
            key={i}
            value={element.val}>
            {element.val}
          </option>
        } else {
          return <option
            key={i}
            value={element.val} disabled>
            読み込み中
          </option>
        }
      });
    } else {
      return elementsArr.map(function (element,i) {
        return <option
          key={i}
          value={element.val}>
          {element.val}
        </option>
      });
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }
  handleClickOutside(e) {
    if (!this.state.mobile && !this.node.contains(e.target)) {
      this.setState(state => Object.assign(state, { active: false }));
    }
  }
  openList(e) {
    e.preventDefault();
    if (e.target.classList.contains('drop-down_head')) {
      this.setState(state => Object.assign(state, { active: true }));
    }
  }
  select(val, node, el) {
    if (typeof el.loaded !== 'undefined' && !el.loaded) {
      return;
    } else {
      this.setState(state => Object.assign(state, { value: node, active: false }));
      if (this.props.onChange) this.props.onChange(val);
    }
  }
  render() {
    const { label, value, elements, className, style } = this.props;

    const valueNode = elements.find(el => el.val === value);

    let view;

    if (this.state.mobile && className === 'brushSize') {
      view = (
        <div
          className={classNames('drop-down-material', className)}
          style={style}
        >
          {label && <div className="label">{label}</div>}
          <select
            value={this.state.selectValueBrush}
            onChange={this.handleChange}
          >
            {this.getElementsOptions()}
          </select>
        </div>
      );
    }else if (this.state.mobile && className !== 'icons') {
      view = (
        <div
          className={classNames('drop-down-material', className)}
          style={style}
        >
          {label && <div className="label">{label}</div>}
          <select
            value={this.state.selectValue}
            onChange={this.handleChange}
          >
            {this.getElementsOptions()}
          </select>
        </div>
      );
    } else if (!this.state.mobile && className === 'fonts') {
      view = (
        <div
          className={classNames('drop-down-material', { active: this.state.active }, className)}
          ref={(node) => { this.node = node; return node; }}
          style={style}
        >
          <div className="drop-down_head" onClick={this.openList}>
            {label && <div className="label">{label}</div>}
            <div className="value">
              {valueNode ? valueNode.node : elements[0].node}
              <div className="arrow" />
            </div>
          </div>
          <div className="list fonts-list">
              {
                elements.map((el, key) => React.cloneElement(el.node,
                  { onClick: () => this.select(el.val, el.node, el), key: key.toString(), className: 'list-item' }
                ))
              }
          </div>
        </div>
      );
    } else {
      view = (
        <div
          className={classNames('drop-down-material', { active: this.state.active }, className)}
          ref={(node) => { this.node = node; return node; }}
          style={style}
        >
          <div className="drop-down_head" onClick={this.openList}>
            {label && <div className="label">{label}</div>}
            <div className="value">
              {valueNode ? valueNode.node : elements[0].node}
              <div className="arrow" />
            </div>
          </div>
          <div className="list">
            <Scrollbars
              autoHide
              hideTracksWhenNotNeeded
              autoHeight
              autoHeightMax={300}
            >
              {
                elements.map((el, key) => React.cloneElement(el.node,
                  { onClick: () => this.select(el.val, el.node, el), key: key.toString(), className: 'list-item' }
                ))
              }
            </Scrollbars>
          </div>
        </div>
      );
    }

    return view;
  }
}

export default DropDownMaterial;

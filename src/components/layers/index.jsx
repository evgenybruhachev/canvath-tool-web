import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { arrayMove } from 'react-sortable-hoc';

import SortableList from './list';

class Layers extends Component {

  static propTypes = {
    items: React.PropTypes.array,
    callbackNewOrder: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onFocus: React.PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      selected: null,
      selection: [],
      moving: false,
      movingstarted: false,
      items: props.items,
      mobile: false,
    };

    this.onClickCallback = this.onClickCallback.bind(this);
    this.onSortStart = this.onSortStart.bind(this);
    // this.onSortMove = this.onSortMove.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.getIsMobile = this.getIsMobile.bind(this);
    this.shouldCancelStart = this.shouldCancelStart.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.getIsMobile, false);
    this.getIsMobile();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      items: nextProps.items,
    });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.getIsMobile, false);
  }
  getIsMobile() {
    this.setState(state => Object.assign(state,
      { mobile: window.matchMedia('(max-width: 1080px)').matches }));
  }
  onClickCallback(uuid, event) {
    const items = this.state.items;
    const item = items.find(i => i.index === uuid);

    if (item.active) {
      this.props.onBlur(uuid);
      item.active = false;
    } else {
      item.active = true;
      this.props.onFocus(uuid);
    }
    this.setState({
      items,
    });
    event.preventDefault();
  }
  shouldCancelStart(e) {
    if (!e.target.className.includes('active')) {
      return true;
    }
  }
  onSortStart(event) {
    const items = this.state.items;
    const selection = items.filter(i => i.active);

    if (selection.length > 1) {
      const helper = document.querySelector('.helper');
      helper.innerHTML = '';
      helper.style.backgroundImage = '';
      helper.style.zIndex = '99999';
      helper.style.display = 'inline-block';
      helper.className = 'helper';
      items.forEach((i, index) => {
        if (i.active) {
          const itemNode = document.querySelector(`.layer[data-uniqueidtoken="layers${index}"]`);
          if (itemNode) {
            const clone = itemNode.cloneNode(true);
            helper.appendChild(clone);
            clone.style.visibility = 'visible';
            clone.style.display = 'block';
            itemNode.style.visibility = 'hidden';
          }
        }
      });
    }
  }
  onSortEnd({ oldIndex, newIndex }) {
    const nodes = document.querySelectorAll('.layer');
    nodes.forEach(node => {
      node.style.display = 'inline-block';
      node.style.visibility = 'visible';
    });

    const items = Object.assign({}, this.state).items;

    let buffer = [];

    var indexes = items
      .map((i, index) => i.active ? index : null)
      .filter(i => i !== null)
      .sort((a, b) => (a - b));

    indexes.forEach((position, i) => {
      buffer.push(items[position - i]);
      items.splice(position - i, 1);
    });

    items.splice(newIndex, 0, ...buffer);

    this.setState({
      items,
    });

    this.props.callbackNewOrder(items);
  }
  render() {
    let view;

    if (!this.state.mobile) {
      view = (
        <Scrollbars
          style={{ width: '100%' }}
          autoHide
          hideTracksWhenNotNeeded
        >
          <SortableList
            uniqueIdToken={'layers'}
            items={this.state.items}
            selection={this.state.selection}
            helperClass="helper"
            onClickCallback={this.onClickCallback}
            onSortEnd={this.onSortEnd}
            onSortStart={this.onSortStart}
            useDragHandle={false}
            distance={10}
            axis="x"
            shouldCancelStart={this.shouldCancelStart}
          />
        </Scrollbars>
      );
    } else {
      view = (
        <SortableList
          uniqueIdToken={'layers'}
          items={this.state.items}
          selection={this.state.selection}
          helperClass="helper"
          onClickCallback={this.onClickCallback}
          onSortEnd={this.onSortEnd}
          onSortStart={this.onSortStart}
          useDragHandle={false}
          axis="x"
          shouldCancelStart={this.shouldCancelStart}
        />
      );
    }
    return view;
  }
};

export default Layers;

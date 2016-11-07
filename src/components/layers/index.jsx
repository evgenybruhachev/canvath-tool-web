import React, { Component } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { Scrollbars } from 'react-custom-scrollbars';
import classNames from 'classnames';

const SortableItem = SortableElement(
  class SortableItemAnonymous extends Component {

    static propTypes = {
      index: React.PropTypes.number,
      onClickCallback: React.PropTypes.func,
      uniqueIdToken: React.PropTypes.string,
      checked: React.PropTypes.bool,
      preview: React.PropTypes.string,
      uuid: React.PropTypes.string,
    }

    constructor(props) {
      super(props);
      this.onClickCallback = this.onClickCallback.bind(this);
      this.getIsMobile = this.getIsMobile.bind(this);

      this.state = {
        mobile: false,
      }
    }
    componentDidMount() {
      window.addEventListener('resize', this.getIsMobile, false);
      this.getIsMobile();
    }
    componentWillUnmount() {
      window.removeEventListener('resize', this.getIsMobile, false);
    }
    getIsMobile() {
      this.setState(state => Object.assign(state,
        { mobile: window.matchMedia('(max-width: 768px)').matches }));
    }

    onClickCallback(event) {
      return this.props.onClickCallback(this.props.index, this.props.uuid, event);
    }

    render() {
      const id = `${this.props.uniqueIdToken}SortableItem${this.props.index}`;
      const className = this.props.checked ? 'active' : '';

      let view;

      if (this.state.mobile) {
        view = (
          <li
            key={`li-sortable-item-${id}`}
            data-sortableId={id}
            onMouseDown={this.onClickCallback}
            className={classNames('layer', className)}
            data-uuid={this.props.uuid}
            style={{ backgroundImage: `url(${this.props.preview})` }}
          />
        );
      } else {
        view = (
          <li
            key={`li-sortable-item-${id}`}
            data-sortableId={id}
            onClick={this.onClickCallback}
            className={classNames('layer', className)}
            data-uuid={this.props.uuid}
            style={{ backgroundImage: `url(${this.props.preview})` }}
          />
        );
      }
      return view;
    }
  }
);

const SortableList = SortableContainer(
  ({ items = [], selection, uniqueIdToken, onClickCallback }) => (
    <ul className="layers">
      {items.map((value, index) => {
        const checked = selection ? selection.includes(index) : 0;
        const uuid = value.index;
        return (
          <SortableItem
            key={`sortable-item-${index}`}
            preview={value.preview}
            checked={checked}
            uniqueIdToken={uniqueIdToken}
            index={index}
            onClickCallback={onClickCallback}
            className="layers"
            uuid={uuid}
          />
        );
      })
    }
    </ul>
  )
);

export default class Layers extends Component {

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
    this.onSortMove = this.onSortMove.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.getIsMobile = this.getIsMobile.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.getIsMobile, false);
    this.getIsMobile();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: null,
      selection: [],
      moving: false,
      movingstarted: false,
      items: nextProps.items,
    });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.getIsMobile, false);
  }
  getIsMobile() {
    this.setState(state => Object.assign(state,
      { mobile: window.matchMedia('(max-width: 768px)').matches }));
  }
  onClickCallback(index, uuid, event) {
    const newSelection = this.state.selection;
    const testIndex = newSelection.indexOf(index);
    if (testIndex === -1) {
      newSelection.push(index);
      this.props.onFocus(uuid);
    } else {
      this.props.onBlur(uuid);
      newSelection.splice(testIndex, 1);
    }
    this.setState({
      selected: index,
      selection: newSelection.sort((a, b) => a - b),
    });
    event.preventDefault();
    // return false;
  }
  onSortStart({ node, index, collection }, event) {
    if (this.state.selection.length) {
      this.setState({
        movingstarted: true,
      });
    }
  }
  onSortMove(event) {
    if (!this.state.moving && this.state.movingstarted) {
      const selection = this.state.selection;
      const selected = this.state.selected;
      const items = this.state.items;


      let indexSelected = selected;
      let i = selection.length - 1;

      for (; i >= 0; i -= 1) {
        const j = selection[i];
        if (j !== selected) {
          if (j < indexSelected) indexSelected -= 1;
          items[j].height = 0;
          items[j].visibility = 'hidden';
        } else {
          items[j].height = items[j].defaultHeight * selection.length;
        }
      }

      this.setState({
        items,
        moving: true,
      });
    }
  }
  onSortEnd({ oldIndex, newIndex }) {
    let _newIndex = newIndex;

    if (this.state.moving && this.state.movingstarted) {
      if (this.state.selection.length > 0) {
        let newOrder = [];
        const toPushInNewOrderLater = [];
        for (let idx = 0; idx < this.state.items.length; idx += 1) {
          const item = `${idx}-${this.state.items[idx].index}`;
          if (this.state.selection.indexOf(idx) === -1) {
            if (_newIndex > oldIndex) {
              if (idx <= _newIndex) {
                newOrder.push(item);
              } else if (idx > _newIndex) {
                toPushInNewOrderLater.push(item);
              }
            } else if (idx < _newIndex) {
              newOrder.push(item);
            } else if (idx >= _newIndex) {
              toPushInNewOrderLater.push(item);
            }
          }
        }

        const selectedItems = this.state.selection.map(idx => this.state.items[idx].index);

        newOrder = newOrder.concat(this.state.selection).concat(toPushInNewOrderLater);

        const newitems = this.state.items;
        let newselection = this.state.selection;
        let newselected = this.state.selected;

        const selectionToPush = [];
        let i = this.state.selection.length - 1;
        for (; i >= 0; i -= 1) {
          const index = this.state.selection[i];
          if (index < _newIndex && index !== this.state.selected) _newIndex -= 1;
          selectionToPush.unshift(newitems[index]);
          newitems.splice(index, 1);
        }

        let k = 0;
        let j = 0;
        for (; j < selectionToPush.length; j += 1) {
          selectionToPush[j].height = selectionToPush[j].defaultHeight;
          selectionToPush[j].visibility = 'visible';
          newitems.splice(_newIndex + k, 0, selectionToPush[j]);
          k += 1;
        }

        if (oldIndex !== _newIndex || (oldIndex === _newIndex && this.state.selection.length > 1)) {
          newselection = [];
          newselected = null;
        }

        this.setState({
          items: newitems,
          selected: newselected,
          selection: newselection,
          moving: false,
          movingstarted: false,
        });

        this.props.callbackNewOrder(selectedItems, oldIndex, newIndex);
      }
    }
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
            selected={this.state.selected}
            helperClass="helper"
            onClickCallback={this.onClickCallback}
            onSortEnd={this.onSortEnd}
            onSortStart={this.onSortStart}
            onSortMove={this.onSortMove}
            useDragHandle={false}
            distance={10}
            axis="x"
          />
        </Scrollbars>
      )
    } else {
      view = (
        <SortableList
          uniqueIdToken={'layers'}
          items={this.state.items}
          selection={this.state.selection}
          selected={this.state.selected}
          helperClass="helper"
          onClickCallback={this.onClickCallback}
          onSortEnd={this.onSortEnd}
          onSortStart={this.onSortStart}
          onSortMove={this.onSortMove}
          useDragHandle={false}
          axis="x"
        />
      )
    }
    return view;
  }
}

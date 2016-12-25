import React, { Component } from 'react';
import { SortableElement } from 'react-sortable-hoc';
import classNames from 'classnames';

const SortableItem = SortableElement(
  class SortableItemAnonymous extends Component {

    static propTypes = {
      onClickCallback: React.PropTypes.func,
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
      };
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
        { mobile: window.matchMedia('(max-width: 1080px)').matches }));
    }

    onClickCallback(event) {
      return this.props.onClickCallback(this.props.uuid, event);
    }

    render() {
      const className = this.props.checked ? 'active' : '';

      let view;

      if (this.state.mobile) {
        view = (
          <li
            onMouseDown={this.onClickCallback}
            className={classNames('layer', className)}
            data-uuid={this.props.uuid}
            data-uniqueIdToken={this.props.uniqueIdToken + this.props.index}
            style={{ backgroundImage: `url(${this.props.preview})` }}
          />
        );
      } else {
        view = (
          <li
            onClick={this.onClickCallback}
            className={classNames('layer', className)}
            data-uuid={this.props.uuid}
            data-uniqueIdToken={this.props.uniqueIdToken + this.props.index}
            style={{ backgroundImage: `url(${this.props.preview})` }}
          />
        );
      }
      return view;
    }
  }
);

export default SortableItem;
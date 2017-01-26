import React, { Component } from 'react';
import classNames from 'classnames';

class Sticker extends Component {

    static propTypes = {
        path: React.PropTypes.string,
        onClick: React.PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        this.props.onClick(this.props.path);
    }

    render() {
        return (
            <div
                className={classNames('sticker')}
                onClick={this.handleOnClick}
                style={{ backgroundImage: `url(${this.props.path})` }}
            />
        );
    }
}

export default Sticker;

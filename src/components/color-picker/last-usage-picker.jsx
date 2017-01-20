import React from 'react';
import { CirclePicker } from 'react-color';

class LastUsagePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            circleSize: 36,
            circleSpacing: 23,
            width: 354
        };
        this.handleColorChange = this.handleColorChange.bind(this);
    };
    handleColorChange (e) {
        this.props.updateColor(e.rgb);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ colors: nextProps.colors });
    }

    render() {
        return <CirclePicker
            colors = {this.state.colors}
            circleSize = {this.state.circleSize}
            circleSpacing = {this.state.circleSpacing}
            width = {this.state.width}
            onChangeComplete={this.handleColorChange}
        />;
    }
}
export default LastUsagePicker;
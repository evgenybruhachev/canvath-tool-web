import React, { Component } from 'react';
import Icon from '../../components/icon';
//import { SketchPicker } from 'react-color';
//import { JmColorPicker } from 'jm-color-picker';


class ColorPicker extends Component {
    static propTypes = {
        color: React.PropTypes.string,
        label: React.PropTypes.string,
        onChange: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            displayColorPicker: false,
            color: props.color || 'rgba(0,162,255,1)',
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.setColorByPick = this.setColorByPick.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({color: props.color});
    }

    handleClick() {
        this.setState({displayColorPicker: !this.state.displayColorPicker});
        this.jmColorPicker = colorPicker();
    }

    handleClose() {
        this.setState({displayColorPicker: false});
    }

    handleChangeComplete(color) {
        const rgb = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a || 1})`;
        this.setState({color: rgb});
        if (this.props.onChange) {
            this.props.onChange(rgb);
        }
        this.state.displayColorPicker = false;
    }

    setColorByPick() {
        var color = this.jmColorPicker.getColorValue();
        this.handleChangeComplete(color);
    }

    render() {
        return (
            <div className="color-picker">
                <div className="swatch" onClick={this.handleClick}>
                    <div className="color" style={{ backgroundColor: this.state.color }}/>
                    <div className="label">{this.props.label}</div>
                </div>
                <div className={this.state.displayColorPicker ? 'popover show' : 'popover'}>
                    <header>
                        <button className="close" onClick={this.handleClose}>
                            <Icon icon={'close'}/>
                        </button>
                        <div className="ready-colors">
                            <button className="color-black" onClick={this.handleChangeComplete.bind({rgb: {r: 0, g: 0, b: 0}})}/>
                            <button className="color-white" onClick={this.handleChangeComplete.bind({rgb: {r: 255, g: 255, b: 255}})}/>
                            <button className="color-opacity"/>
                        </div>
                        <button className="done" onClick={this.setColorByPick}>
                            <Icon icon={'done'}/>
                        </button>
                    </header>
                    <div className="jm-color-picker">
                        <canvas width="250" height="250" id="color-picker-place"/>
                        <div id="color-picker-cursor"></div>
                        <div id="slider-opacity" className="color-picker-slider">
                            <div className="thumb"></div>
                        </div>
                        <div id="slider-brightness" className="color-picker-slider">
                            <div className="thumb"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ColorPicker;

import React, { Component } from 'react';
import Icon from '../../components/icon';
import PreinstalledPicker from './preinstalled-picker';
import LastUsagePicker from './last-usage-picker';
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
            displayThisTabOne: true,
            showLastUsegeBlock: false,
            color: props.color || 'rgba(0,162,255,1)',
            lastColors: []
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.setColorByPick = this.setColorByPick.bind(this);
        this.handleChangeTabsOne = this.handleChangeTabsOne.bind(this);
        this.handleChangeTabsTwo = this.handleChangeTabsTwo.bind(this);
        this.handleColorUpdate = this.handleColorUpdate.bind(this);
        this.pushLastUsageArr = this.pushLastUsageArr.bind(this);
        this.rgb2hex = this.rgb2hex.bind(this);
    }

    componentDidMount() {
        this.jmColorPicker = colorPicker();
    }

    componentWillReceiveProps(props) {
        this.setState({color: props.color});
    }

    handleClick() {
        this.setState({displayColorPicker: !this.state.displayColorPicker});
        this.setState({displayThisTabOne: true});
    }

    handleClose() {
        this.setState({
            displayColorPicker: false,
            displayThisTabOne: false,
            displayThisTabTwo: false
        });
    }

    handleChangeComplete(color) {
        const rgb = `rgba(${color.r}, ${color.g}, ${color.b}, ${typeof color.a !== 'undefined' ? color.a : 1})`;
        this.setState({color: rgb});
        if (this.props.onChange) {
            this.props.onChange(rgb);
        }
        this.state.displayColorPicker = false;
    }
    handleColorUpdate (colorValue) {
        this.state.colorCheck = colorValue
    }
    setColorByPick() {
        var color;
        if(this.state.displayThisTabOne) {
            color = this.jmColorPicker.getColorValue();
        }
        else {
            color = this.state.colorCheck;
        }
        this.handleChangeComplete(color);
        this.pushLastUsageArr(color);
        this.setState({
            displayThisTabOne: false,
            displayThisTabTwo: false
        });
    }

    pushLastUsageArr (val) {
        var rgb = `rgba(${val.r}, ${val.g}, ${val.b}, ${typeof val.a !== 'undefined' ? val.a : 1})`;
        var hex = this.rgb2hex(rgb);
        var arr = this.state.lastColors;
        if(arr === undefined) {
            arr = [];
            hex = null;
        } else {
            arr = this.state.lastColors;
            if(arr.length<6){
                for(var i = 0; i<arr.length; i++){
                    if(arr[i] === hex){
                        arr.splice(i,1);
                    }
                }
                arr.splice(0, 0, hex);
            } else if(!arr.length){
                arr = [];
            } else {
                for(var u = 0; u<arr.length; u++){
                    if(arr[u] === hex){
                        arr.splice(u,1);
                    }
                }
                if(arr.length === 6){
                    arr.splice(5, 1);
                }
                arr.splice(0, 0, hex);
            }
        }
        this.setState({
            lastColors: arr,
            showLastUsegeBlock: true
        });
    }

    rgb2hex(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }

    handleChangeTabsOne() {
        this.setState({displayThisTabOne: true,displayThisTabTwo: false});
    }

    handleChangeTabsTwo() {
        this.setState({displayThisTabTwo: true,displayThisTabOne: false});
    }
    render() {
        return (
            <div className="color-picker">
                <div className={this.state.displayColorPicker ? 'color-picker-substrate show' : 'color-picker-substrate'} onClick={this.handleClose}></div>
                <div className="swatch" onClick={this.handleClick}>
                    <div className="color" style={{ backgroundColor: this.state.color }}/>
                    <div className="label">{this.props.label}</div>
                </div>
                <div  className={this.state.displayColorPicker ? 'popover show' : 'popover'}>
                    <header>
                        <button className="close" onClick={this.handleClose}>
                            <Icon icon={'close'}/>
                        </button>
                        <h3 className="h3">カラー選択</h3>
                        <button className="done" onClick={this.setColorByPick}>
                            <Icon icon={'done'}/>
                        </button>
                    </header>
                    <div className="jm-color-picker">

                        <div className="tab-links-wrap">
                            <a href="#" className={this.state.displayThisTabOne ? 'tab-link active' : 'tab-link'} onClick={this.handleChangeTabsOne}>コレクション</a>
                            <a href="#" className={this.state.displayThisTabTwo ? 'tab-link active' : 'tab-link'} onClick={this.handleChangeTabsTwo}>カスタム</a>
                        </div>

                        <div className={this.state.displayThisTabOne ? 'tab-content tab-content-colors' : 'tab-content tab-content-colors hideTab'}>
                            <div className="left-place">
                                <canvas width="310" height="310" id="color-picker-place"/>
                                <div id="color-picker-cursor"></div>
                            </div>
                            <div className="right-place">
                                <div id="slider-opacity" className="color-picker-slider">
                                    <div className="thumb"></div>
                                </div>
                                <div id="slider-brightness" className="color-picker-slider">
                                    <div className="thumb"></div>
                                </div>
                            </div>
                        </div>

                        <div className={this.state.displayThisTabTwo ? 'tab-content tab-content-custom' : 'tab-content tab-content-custom hideTab'}>

                            <div className={"last-usage-wrap " + (this.state.showLastUsegeBlock ? 'show' : 'hidden')}>
                                <LastUsagePicker updateColor={this.handleColorUpdate} colors={this.state.lastColors} />
                            </div>

                            <div className="preinstalled-wrap">
                                <PreinstalledPicker updateColor={this.handleColorUpdate}  />
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default ColorPicker;

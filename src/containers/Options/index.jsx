import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Scrollbars } from 'react-custom-scrollbars';

import Layers from '../../components/layers';

import Sticker from '../../components/sticker';
import StickerShape from '../../components/sticker-shapes';

import Button from '../../components/button';
import ButtonShape from '../../components/button-shapes';
import DropDownM from '../../components/drop-down-material';
import ColorPicker from '../../components/color-picker';
import Icon from '../../components/icon';
import AddTextForm from '../../components/add-text-form';

import * as actions from '../../actions/draw-tool';
import * as ProductActions from '../../actions/product';

import { getStickers, getShapes } from '../../api/extras';

class Options extends Component {

    static propTypes = {
        activeTool: React.PropTypes.string,
        availableBrushes: React.PropTypes.array,
        availableFonts: React.PropTypes.array,
        availableShapesCategories: React.PropTypes.array,
        availableShapes: React.PropTypes.array,
        activeBrush: React.PropTypes.string,
        brushOptions: React.PropTypes.object,
        textOptions: React.PropTypes.object,
        dispatch: React.PropTypes.func,
        layers: React.PropTypes.object,
        side: React.PropTypes.object,
        shapeColor: React.PropTypes.string,
        text: React.PropTypes.string,
        textEl: React.PropTypes.object,
        stickersCat: React.PropTypes.array,
        stickers: React.PropTypes.array,
        colorPicker: React.PropTypes.bool,
        colorPickerColor: React.PropTypes.string,
        selected: React.PropTypes.object,
        colors: React.PropTypes.array,
        colorSelected: React.PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.getStickers = this.getStickers.bind(this);
        this.getShapes = this.getShapes.bind(this);
        this.getSideTitle = this.getSideTitle.bind(this);
        this.toggleOptions = this.toggleOptions.bind(this);
        this.changeColorSVG = this.changeColorSVG.bind(this);
        this.showOptions = true;
        this.lastState = null;
    }

    getStickers(id) {
        const { dispatch } = this.props;
        getStickers(id).then(data => dispatch(actions.updateStickers(data)));
    }

    getShapes(id) {
        const { dispatch } = this.props;
        getShapes(id).then(data => dispatch(actions.updateShapes(data)));
    }

    getSideTitle() {
        if (this.props.side) {
            return JSON.parse(this.props.side.content).id;
        }
    }

    toggleOptions() {
        if (this.lastState == this.props.activeTool){
            this.showOptions = !this.showOptions;
            this.forceUpdate();
        }
    }

    componentDidUpdate() {
        if (this.lastState != this.props.activeTool){
            this.showOptions = true;
            this.forceUpdate();
        }

        this.lastState = this.props.activeTool;
    }

    changeColorSVG() {
        $('.sticker svg').css('fill', shapeColor)
    }

    render() {
        const {
            activeTool,
            availableBrushes,
            availableFonts,
            availableShapesCategories,
            availableShapes,
            activeBrush,
            textOptions,
            brushOptions,
            layers,
            side,
            dispatch,
            shapeColor,
            text,
            textEl,
            stickersCat,
            stickers,
            colorPicker,
            colorPickerColor,
            selected,
            colors,
            colorSelected,
            } = this.props;

        let content;

        switch (activeTool) {

            case 'sides':
                content = (
                    <div className="options">
                        <div className={this.showOptions ? 'top show' : 'top'}>
                            <Scrollbars
                                style={{ width: '100%' }}
                                autoHide
                                hideTracksWhenNotNeeded
                            >
                                <div className="sides">
                                    {
                                        colors && colors.find(color => color.ProductColor.id === colorSelected.id).sides
                                            .map((side, index) => <div
                                            className="side"
                                            key={index}
                                            onClick={() => dispatch(ProductActions.selectSide(side.ProductColorSide.id))}
                                        >
                                            <img src={side.ProductColorSide.image_url} alt="" className="preview"/>
                                            <div className="title">{side.ProductColorSide.title}</div>
                                        </div>)
                                        }
                                </div>
                            </Scrollbars>
                        </div>
                        <button onClick={this.toggleOptions}
                                className="options-toggle-button"><div>{this.showOptions ? '非表示' : '表示'}</div></button>
                    </div>
                );
                break;
            case 'colors':
                content = (
                    <div className="options">
                        <div className={this.showOptions ? 'top show' : 'top'}>
                            <Scrollbars
                                style={{ width: '100%' }}
                                autoHide
                                hideTracksWhenNotNeeded
                            >
                                <div className="colors">
                                    {
                                        colors && colors.map((color, index) => <div
                                            className={'color'}
                                            key={index}
                                            style={{backgroundColor: color.ProductColor.value}}
                                            onClick={() => dispatch(ProductActions.selectColor(color.ProductColor.id))}
                                        />)
                                        }
                                </div>
                            </Scrollbars>
                        </div>
                        <button onClick={this.toggleOptions}
                                className="options-toggle-button"><div>{this.showOptions ? '非表示' : '表示'}</div></button>
                    </div>
                );
                break;
            case 'pointer':
                content = (
                    <div className="options">
                        <div className={this.showOptions ? 'top show' : 'top'}>
                            <Button icon={'align-top'} label={'上'}
                                    onClick={() => dispatch(actions.alignItem('toTop'))}/>
                            <Button icon={'align-ver-center'} label={'垂直揃え'}
                                    onClick={() => dispatch(actions.alignItem('toVCenter'))}/>
                            <Button icon={'align-bottom'} label={'下'}
                                    onClick={() => dispatch(actions.alignItem('toBottom'))}/>
                            <Button icon={'align-left'} label={'左'}
                                    onClick={() => dispatch(actions.alignItem('toLeft'))}/>
                            <Button icon={'align-hor-center'} label={'水平揃え'}
                                    onClick={() => dispatch(actions.alignItem('toHCenter'))}/>
                            <Button icon={'align-right'} label={'右'}
                                    onClick={() => dispatch(actions.alignItem('toRight'))}/>
                        </div>
                        <button onClick={this.toggleOptions}
                                className="options-toggle-button"><div>{this.showOptions ? '非表示' : '表示'}</div></button>
                    </div>
                );
                break;
            case 'brush':
                content = (
                    <div className="options">
                        <div className={this.showOptions ? 'top show' : 'top'}>
                            <DropDownM
                                className="icons"
                                value={activeBrush}
                                onChange={brush => dispatch(actions.selectBrush(brush))}
                                elements={availableBrushes
                  .map(brush => ({ val: brush, node: <Icon icon={brush} /> }))
                }
                            />
                            <ColorPicker
                                label="カラー選択"
                                color={brushOptions.color}
                                onChange={color => dispatch(actions.selectBrushColor(color))}
                            />
                            <DropDownM
                                label="サイズ"
                                value={brushOptions.width.toString()}
                                elements={[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100]
                  .map((i, index) => ({ val: String(i), node: <span>{i}px</span> })
                )}
                                onChange={size => dispatch(actions.selectBrushSize(size))}
                            />
                        </div>
                        <button onClick={this.toggleOptions}
                                className="options-toggle-button"><div>{this.showOptions ? '非表示' : '表示'}</div></button>
                    </div>
                );
                break;
            case 'text':
                content = (
                    <div className="options">
                        <div className={this.showOptions ? 'top show' : 'top'}>

                            <ColorPicker
                                label="カラー選択"
                                color={textOptions.color}
                                onChange={color => dispatch(actions.selectTextColor(color))}
                            />

                            <DropDownM
                                label="フォント"
                                value={textOptions.font}
                                elements={availableFonts.map(font => ({ val: font,
                  node: <span style={{ fontFamily: font }}>{font}</span> }))}
                                onChange={font => dispatch(actions.selectTextFont(font))}
                                className="fonts"
                            />

                            <DropDownM
                                label="サイズ"
                                value={textOptions.size.toString()}
                                elements={[6, 8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72]
                  .map(size => ({ val: size.toString(), node: <span>{size}</span> }))}
                                onChange={size => dispatch(actions.selectTextSize(size))}
                            />

                            {/* <Button
                             icon={'text-align-justify'}
                             label={'Justify'}
                             onClick={() => dispatch(actions.selectTextAlign('justify'))}
                             active={textOptions.align === 'justify'}
                             /> */}
                            <Button
                                icon={'text-align-left'}
                                label={'左'}
                                onClick={() => dispatch(actions.selectTextAlign('left'))}
                                active={textOptions.align === 'left'}
                            />
                            <Button
                                icon={'text-align-center'}
                                label={'真ん中'}
                                onClick={() => dispatch(actions.selectTextAlign('center'))}
                                active={textOptions.align === 'center'}
                            />
                            <Button
                                icon={'text-align-right'}
                                label={'右'}
                                onClick={() => dispatch(actions.selectTextAlign('right'))}
                                active={textOptions.align === 'right'}
                            />

                            <Button
                                icon={'text-bold'}
                                label={'ボールド'}
                                onClick={() => dispatch(actions.selectTextBold(!textOptions.bold))}
                                active={textOptions.bold}
                            />
                            <Button
                                icon={'text-italic'}
                                label={'イタリック'}
                                onClick={() => dispatch(actions.selectTextItalic(!textOptions.italic))}
                                active={textOptions.italic}
                            />

                            <Button
                                icon={'text-vertical'}
                                label={'縦書'}
                                onClick={() => dispatch(actions.selectTextVertical(!textOptions.vertical))}
                                active={textOptions.vertical}
                            />
                            {/* <Button icon={'text-underline'} label={'Underline'} /> */}
                        </div>
                        <div className={this.showOptions ? 'bottom show' : 'bottom'}>
                            <AddTextForm
                                value={text}
                                selected={!!textEl}
                                onSubmit={val => dispatch(textEl ? actions.changeText(val) : actions.addText(val))}
                                onChange={val => dispatch(actions.changeTextVal(val))}
                            />
                        </div>
                        <button onClick={this.toggleOptions}
                                className="options-toggle-button"><div>{this.showOptions ? '非表示' : '表示'}</div></button>
                    </div>
                );
                break;
            case 'sticker':
                content = (
                    <div className="options">
                        <div className={this.showOptions ? 'top show' : 'top'}>
                            {stickersCat.map((cat, index) => <Button
                                image={cat.content_url}
                                label={cat.title}
                                onClick={() => this.getStickers(cat.id)}
                                key={index}
                            />)}
                        </div>
                        {stickers.length ? <div className={this.showOptions ? 'bottom show' : 'bottom'}>
                            <Scrollbars
                                style={{ width: '100%' }}
                                autoHide
                                hideTracksWhenNotNeeded
                            >
                                <div className="stickers">
                                    {stickers.map((sticker, index) => <Sticker
                                        path={sticker} key={index} onClick={url => dispatch(actions.insertSticker(url))}
                                    />)}
                                </div>
                            </Scrollbars>
                        </div> : null
                            }
                        <button onClick={this.toggleOptions}
                                className="options-toggle-button"><div>{this.showOptions ? '非表示' : '表示'}</div></button>
                    </div>
                );
                break;
            case 'shapes':
                content = (
                    <div className="options">
                        <div className={this.showOptions ? 'top show' : 'top'}>
                            <ColorPicker
                                label="カラー選択"
                                color={shapeColor}
                                onChange={color => dispatch(actions.selectShapeColor(color))}
                            />
                            {availableShapesCategories.map((shape, index) => (
                            <ButtonShape
                                image={shape.content_url}
                                label={shape.title}
                                key={index}
                                onClick={() => this.getShapes(shape.id)}
                                color={shapeColor}
                            />)
                                )}
                        </div>
                        {availableShapes.length ? <div className={this.showOptions ? 'bottom show' : 'bottom'}>
                            <Scrollbars
                                style={{ width: '100%' }}
                                autoHide
                                hideTracksWhenNotNeeded
                            >
                                <div className="stickers">
                                    {availableShapes.map((shape, index) => <StickerShape
                                        path={shape}
                                        key={index}
                                        onClick={() => dispatch(actions.insertShape(shape))}
                                        color={shapeColor}
                                    />)}
                                </div>
                            </Scrollbars>
                        </div> : null
                            }
                        <button onClick={this.toggleOptions}
                                className="options-toggle-button"><div>{this.showOptions ? '非表示' : '表示'}</div></button>
                    </div>
                );
                break;
            case 'removeColor':
                if (!selected) {
                    content = (
                        <div className="options">
                            <div className={this.showOptions ? 'top show' : 'top'}>
                                画像を選びください
                            </div>
                            <button onClick={this.toggleOptions}
                                    className="options-toggle-button"><div>{this.showOptions ? '非表示' : '表示'}</div></button>
                        </div>
                    );
                } else {
                    content = (
                        <div className="options">
                            <div className={this.showOptions ? 'top show' : 'top'}>
                                <ColorPicker
                                    label="カラー選択"
                                    color={colorPickerColor}
                                    onChange={color => dispatch(actions.updateColorPicker(color))}
                                />
                                <Button icon={'pipette'} label={'色選択'}
                                        onClick={() => dispatch(actions.toggleColorPicker(!colorPicker))}/>
                                <Button icon={'close'} label={'カラー透明化'}
                                        onClick={() => dispatch(actions.removeColor())}/>
                            </div>
                            <button onClick={this.toggleOptions}
                                    className="options-toggle-button"><div>{this.showOptions ? '非表示' : '表示'}</div></button>
                        </div>
                    );
                }
                break;
            case 'layers':
                content = (
                    <div className="options">
                        <div className={this.showOptions ? 'top show' : 'top'}>
                            <Button icon={'align-top'} label={'上'}
                                    onClick={() => dispatch(actions.alignLayer('toTop'))}/>
                            <Button icon={'align-ver-center'} label={'垂直揃え'}
                                    onClick={() => dispatch(actions.alignLayer('toVCenter'))}/>
                            <Button icon={'align-bottom'} label={'下'}
                                    onClick={() => dispatch(actions.alignLayer('toBottom'))}/>
                            <Button icon={'align-left'} label={'左'}
                                    onClick={() => dispatch(actions.alignLayer('toLeft'))}/>
                            <Button icon={'align-hor-center'} label={'水平揃え'}
                                    onClick={() => dispatch(actions.alignLayer('toHCenter'))}/>
                            <Button icon={'align-right'} label={'右'}
                                    onClick={() => dispatch(actions.alignLayer('toRight'))}/>
                        </div>
                        <div className={this.showOptions ? 'bottom show' : 'bottom'}>
                            <Layers
                                items={side && layers[this.getSideTitle()] && layers[this.getSideTitle()]}
                                callbackNewOrder={(items) => dispatch(actions.sortLayers({ items }))}
                                onBlur={id => dispatch(actions.blurLayer(id))}
                                onFocus={id => dispatch(actions.focusLayer(id))}
                            />
                        </div>
                        <button onClick={this.toggleOptions}
                                className="options-toggle-button"><div>{this.showOptions ? '非表示' : '表示'}</div></button>
                    </div>
                );
                break;
            default:
                content = (null);
        }

        return content;
    }

}


function mapStateToProps(state) {
    return {
        activeTool: state.drawTool.activeTool,
        activeBrush: state.drawTool.activeBrush,
        brushOptions: state.drawTool.brushOptions,
        textOptions: state.drawTool.textOptions,
        availableBrushes: state.drawTool.availableBrushes,
        availableFonts: state.drawTool.availableFonts,
        availableShapesCategories: state.drawTool.availableShapesCategories,
        availableShapes: state.drawTool.availableShapes,
        layers: state.drawTool.layers,
        side: state.product.sideSelected,
        shapeColor: state.drawTool.shapeColor,
        text: state.drawTool.text,
        textEl: state.drawTool.textEl,
        stickersCat: state.drawTool.stickersCat,
        stickers: state.drawTool.stickers,
        colorPicker: state.drawTool.colorPicker,
        colorPickerColor: state.drawTool.colorPickerColor,
        selected: state.drawTool.selected,
        colors: state.product.colors,
        colorSelected: state.product.colorSelected,
    };
}

export default connect(
    mapStateToProps
)(Options);

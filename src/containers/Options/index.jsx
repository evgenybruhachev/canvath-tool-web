import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Scrollbars } from 'react-custom-scrollbars';

import Layers from '../../components/layers';

import Sticker from '../../components/sticker';
import StickerShape from '../../components/sticker-shapes';

import Button from '../../components/button';
import Upload from '../../components/upload';

import EXIF from 'exif-js';
import {uploadByString, uploadPdf} from '../../api/extras';

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
        availableFontsJP: React.PropTypes.array,
        availableFontsEN: React.PropTypes.array,
        availableFontsCategories: React.PropTypes.array,
        availableShapesCategories: React.PropTypes.array,
        availableShapes: React.PropTypes.array,
        loadedAvailableShapes: React.PropTypes.array,
        activeBrush: React.PropTypes.string,
        brushOptions: React.PropTypes.object,
        textOptions: React.PropTypes.object,
        categoriesFontsOptions: React.PropTypes.object,
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
        svgStickerShapesLoading: React.PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
          availableFonts:[]
        };

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
        dispatch(actions.loadingSVG(false));
        dispatch(actions.stickerShapeSvgLoad());
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

    componentWillReceiveProps(nextProps){
        if((nextProps.availableFonts != this.props.availableFonts || nextProps.activeTool == 'text')
            && (typeof nextProps.availableFontsJP != 'undefined' || typeof nextProps.availableFontsEN != 'undefined')){

            if(typeof nextProps.availableFontsJP != 'undefined' && nextProps.categoriesFontsOptions.title === "\u65e5\u672c\u8a9e") {
                this.setState({ availableFonts: nextProps.availableFontsJP });
            } else if(typeof nextProps.availableFontsEN != 'undefined'){
                this.setState({ availableFonts: nextProps.availableFontsEN });
            }

            Array.prototype.forEach.call(this.props.availableFontsCategories, (item, index, arr) => {
                if(typeof this.props.availableFontsJP == 'undefined' && item == '\u65e5\u672c\u8a9e')
                    this.props.availableFontsCategories.splice(index, 1);

                if(typeof this.props.availableFontsEN == 'undefined' && item == '\u82f1\u8a9e')
                    this.props.availableFontsCategories.splice(index, 1);
            });
        }
    }

    changeColorSVG() {
        $('.sticker svg').css('fill', shapeColor)
    }

    fileUpload(file) {
        const {dispatch} = this.props;
        const vCanv = document.createElement('canvas');
        const vCtx = vCanv.getContext('2d');

        dispatch(actions.setLoading(true));

        const getImage = (file) => {
        return new Promise((resolve, reject) => {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif'
            && file.type !== 'application/postscript' && file.type !== 'application/pdf')
            reject('JPEG,GIF,PNG,PDF,AIのみ対応しています');

            const img = new Image();
            img.onload = function () {
            resolve(img);
            };

            img.src = URL.createObjectURL(file);

        });
        };

        const getBase64 = (file, image) => {
        return new Promise((resolve) => {
            EXIF.getData(file, () => {
            const orientation = EXIF.getTag(file, 'Orientation');

            vCanv.width = image.width;
            vCanv.height = image.height;

            vCtx.save();
            let width = vCanv.width;
            let styleWidth = vCanv.style.width;
            let height = vCanv.height;
            let styleHeight = vCanv.style.height;
            if (orientation) {
                if (orientation > 4) {
                vCanv.width = height;
                vCanv.style.width = styleHeight;
                vCanv.height = width;
                vCanv.style.height = styleWidth;
                }
                switch (orientation) {
                case 2:
                    vCtx.translate(width, 0);
                    vCtx.scale(-1, 1);
                    break;
                case 3:
                    vCtx.translate(width, height);
                    vCtx.rotate(Math.PI);
                    break;
                case 4:
                    vCtx.translate(0, height);
                    vCtx.scale(1, -1);
                    break;
                case 5:
                    vCtx.rotate(0.5 * Math.PI);
                    vCtx.scale(1, -1);
                    break;
                case 6:
                    vCtx.rotate(0.5 * Math.PI);
                    vCtx.translate(0, -height);
                    break;
                case 7:
                    vCtx.rotate(0.5 * Math.PI);
                    vCtx.translate(width, -height);
                    vCtx.scale(-1, 1);
                    break;
                case 8:
                    vCtx.rotate(-0.5 * Math.PI);
                    vCtx.translate(-width, 0);
                    break;
                default:
                    break;
                }
            }

            vCtx.drawImage(image, 0, 0);
            vCtx.restore();
            resolve(vCanv.toDataURL());
            });
        });
        };

        // separate img and pdf
        if (file.type === 'application/postscript' || file.type === 'application/pdf') {
        uploadPdf(file.type, file).then(
            url => {
                DrawTool.sides.selected.items.addImage(url).then(() => {
                    dispatch(actions.setLoading(false));
                });
            },
            err => {
                dispatch(actions.setLoading(false));
                window.alert(err);
            }
        );

        }
        else {
        getImage(file)
            .then(image => getBase64(file, image))
            .then(base64 => uploadByString('image/png', base64, 'png'))
            .then(
            url => {
                DrawTool.sides.selected.items.addImage(url).then(() => {
                dispatch(actions.setLoading(false));
                });
            },
            err => {
                dispatch(actions.setLoading(false));
                window.alert(err);
            }
            );
        }
    }

    render() {

        const {
            activeTool,
            availableBrushes,
            availableFonts,
            availableFontsJP,
            availableFontsEN,
            availableFontsCategories,
            availableShapesCategories,
            availableShapes,
            loadedAvailableShapes,
            svgStickerShapesLoading,
            activeBrush,
            textOptions,
            categoriesFontsOptions,
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
                            <div className="before"></div>
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
                            <div className="after"></div>
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
                            <div className="before"></div>
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
                                            onClick={() => dispatch(ProductActions.selectColor(color.ProductColor.id))}
                                        >
                                            <span className={'colorBG'} style={{backgroundColor: color.ProductColor.value}}></span>
                                            <span className={'colorLabel'}>{color.ProductColor.title}</span>
                                        </div>)
                                    }
                                </div>
                            </Scrollbars>
                            <div className="after"></div>
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
                            <div className="before"></div>
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
                            <div className="after"></div>
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
                            <div className="before"></div>
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
                                className="brushSize"
                                label="サイズ"
                                value={brushOptions.width.toString()}
                                elements={[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100]
                                    .map((i, index) => ({ val: String(i), node: <span>{i}pt</span> })
                                    )}
                                onChange={size => dispatch(actions.selectBrushSize(size))}
                            />
                            <button className="complete-drawing button cart-button" onClick={() => dispatch(actions.setActiveTool('pointer'))}>完了</button>
                            <div className="after"></div>
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
                            <div className="before"></div>

                            <ColorPicker
                                label="カラー選択"
                                color={textOptions.color}
                                onChange={color => dispatch(actions.selectTextColor(color))}
                            />

                            <DropDownM
                              label="言語"
                              value={categoriesFontsOptions.title}
                              elements={availableFontsCategories.map(categoriesFonts => ({ val: categoriesFonts,
                                node: <span>{categoriesFonts}</span> }))}
                              onChange={categoriesFonts => dispatch(actions.selectTextCategoriesFonts(categoriesFonts))}
                              className="categoriesFonts"
                            />

                            <DropDownM
                              label="フォント"
                              value={textOptions.font}
                              elements={this.state.availableFonts.map(font => ({ val: font,
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
                            <div className="after"></div>
                            {/* <Button icon={'text-underline'} label={'Underline'} /> */}
                        </div>
                        <div className={this.showOptions ? 'bottom show' : 'bottom'}>
                            <div className="before"></div>
                            <AddTextForm
                                value={text}
                                selected={!!textEl}
                                onSubmit={val => dispatch(textEl ? actions.changeText(val) : actions.addText(val))}
                                onChange={val => dispatch(actions.changeTextVal(val))}
                            />
                            <div className="after"></div>
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
                            <div className="before"></div>
                            {stickersCat.map((cat, index) => <Button
                                image={cat.content_url}
                                label={cat.title}
                                onClick={() => this.getStickers(cat.id)}
                                key={index}
                            />)}
                            <div className="after"></div>
                        </div>
                        {stickers.length ? <div className={this.showOptions ? 'bottom show' : 'bottom'}>
                            <div className="before"></div>
                            {stickers.map((sticker, index) => <Sticker
                                path={sticker} key={index} onClick={url => dispatch(actions.insertSticker(url))}
                            />)}
                            <div className="after"></div>
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
                            <div className="before"></div>
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
                            <div className="after"></div>
                        </div>
                        { !svgStickerShapesLoading ?  <div className="bottom show"><div className="before"></div><span className="loading">読み込み中</span><div className="after"></div></div> : null }
                        {availableShapes.length && svgStickerShapesLoading ? <div className={this.showOptions ? 'bottom show' : 'bottom'}>
                            <div className="before"></div>
                            {availableShapes.map((shape, index) => <StickerShape
                                path={shape}
                                key={index}
                                onClick={() => dispatch(actions.insertShape(shape))}
                                color={shapeColor}
                            />)}
                            <div className="after"></div>
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
                                <div className="before"></div>
                                画像を選びください
                                <button onClick={this.toggleOptions}
                                    className="options-toggle-button"><div>{this.showOptions ? '非表示' : '表示'}</div></button>
                                <div className="after"></div>
                            </div>
                            <button onClick={this.toggleOptions}
                                className="options-toggle-button"><div>{this.showOptions ? '非表示' : '表示'}</div></button>
                        </div>
                    );
                } else {
                    content = (
                        <div className="options">
                            <div className={this.showOptions ? 'top show' : 'top'}>
                                <div className="before"></div>
                                <ColorPicker
                                    label="カラー選択"
                                    color={colorPickerColor}
                                    onChange={color => dispatch(actions.updateColorPicker(color))}
                                />
                                <Button icon={'pipette'} label={'色選択'}
                                        onClick={() => dispatch(actions.toggleColorPicker(!colorPicker))}/>
                                <Button icon={'close'} label={'カラー透明化'}
                                        onClick={() => dispatch(actions.removeColor())}/>
                                <div className="after"></div>
                            </div>
                            <div className="bottom show">
                                <div className="before"></div>
                                <span className="loading">画像の中の透明化したい色の部分を選んでください、パレットが透明化したい色に変わりましたら透明化ボタンを押してください</span>    
                                <div className="after"></div>
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
                            <div className="before"></div>
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
                            <div className="after"></div>
                        </div>
                        <div className={this.showOptions ? 'bottom show' : 'bottom'}>
                            <div className="before"></div>
                            <Layers
                                items={side && layers[this.getSideTitle()] && layers[this.getSideTitle()]}
                                callbackNewOrder={(items) => dispatch(actions.sortLayers({ items }))}
                                onBlur={id => dispatch(actions.blurLayer(id))}
                                onFocus={id => dispatch(actions.focusLayer(id))}
                            />
                            <div className="after"></div>
                        </div>
                        <button onClick={this.toggleOptions}
                                className="options-toggle-button"><div>{this.showOptions ? '非表示' : '表示'}</div></button>
                    </div>
                );
                break;
            case 'uploadFile':
                    content = (
                        <div className="options">
                            <div className={this.showOptions ? 'top top__upload show' : 'top top__upload'}>
                                <div className="before"></div>
                                <span className="loading">
                                    アップロードをクリックして取り込みたい画像を選択してください。<br className="visible-xs"/>JPEG,GIF,PNG,AI,PDFに対応しています。<br className="visible-xs"/>最大20MBまで
                                </span>
                                <Upload className="cart-button complete-drawing" label={'アップロード'} onUpload={files => this.fileUpload(files[0])}/>
                                <div className="after"></div>
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
        categoriesFontsOptions: state.drawTool.categoriesFontsOptions,
        availableBrushes: state.drawTool.availableBrushes,
        availableFonts: state.drawTool.availableFonts,
        availableFontsJP: state.drawTool.availableFontsJP,
        availableFontsEN: state.drawTool.availableFontsEN,
        availableFontsCategories: state.drawTool.availableFontsCategories,
        availableShapesCategories: state.drawTool.availableShapesCategories,
        availableShapes: state.drawTool.availableShapes,
        loadedAvailableShapes: state.drawTool.loadedAvailableShapes,
        svgStickerShapesLoading: state.drawTool.svgStickerShapesLoading,
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

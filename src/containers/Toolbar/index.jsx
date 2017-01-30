import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import EXIF from 'exif-js';
import classNames from 'classnames';
import Icon from '../../components/icon';

import DrawTool from '../../draw-tool/drawtool';

import Button from '../../components/button';
import Upload from '../../components/upload';

import * as ProductActions from '../../actions/product';

import { uploadByString } from '../../api/extras';

import * as actions from '../../actions/draw-tool';

class Toolbar extends Component {

    static propTypes = {
        activeTool: React.PropTypes.string,
        dispatch: React.PropTypes.func,
        selected: React.PropTypes.object,
        history: React.PropTypes.object,
        colorSelected: React.PropTypes.object,
        sideSelected: React.PropTypes.object,
    }

    constructor(props) {
        super(props);

        this.state = {
            mobile: false,
            height: 600
        };

        this.helpArrows = {
            left: false,
            right: false
        };

        this.getIsMobile = this.getIsMobile.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.helpScrollArrows = this.helpScrollArrows.bind(this);
        this.helpClickArrows = this.helpClickArrows.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.getIsMobile, false);
        this.getIsMobile();
        this.helpScrollArrows();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.getIsMobile, false);
        this.helpScrollArrows();
    }

    helpClickArrows(arrow) {
        var toolbar = document.getElementsByClassName('toolbar')[0];
        if(arrow == 'right')
            toolbar.scrollLeft += 70;
        else
            toolbar.scrollLeft -= 70;
    }

    helpScrollArrows() {
        var toolbar = document.getElementsByClassName('toolbar')[0];
        var toolbarWidth = toolbar.scrollWidth;

        if (toolbarWidth > 759)
            toolbarWidth = 759;

        if (toolbarWidth > window.innerWidth) {
            this.helpArrows.right = true;
            this.forceUpdate();

            if (toolbar.scrollLeft >= 70) {
                this.helpArrows.left = true;
                this.forceUpdate();
            }

            if (toolbar.scrollLeft + window.innerWidth >= toolbarWidth) {
                this.helpArrows.right = false;
                this.forceUpdate();
            }

            if (toolbar.scrollLeft <= 0) {
                this.helpArrows.left = false;
                this.forceUpdate();
            }
        }
    }

    getIsMobile() {
        this.setState(state => Object.assign(state,
            {
                mobile: window.matchMedia('(max-width: 1079px)').matches,
                height: window.innerHeight,
            }));
    }

    fileUpload(file) {
        const { dispatch } = this.props;

        const vCanv = document.createElement('canvas');
        const vCtx = vCanv.getContext('2d');

        dispatch(actions.setLoading(true));

        const getImage = (file) => {
            return new Promise((resolve, reject) => {
                if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif'
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

        getImage(file).then(image => getBase64(file, image))
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

    undo() {
        const { dispatch } = this.props;
        dispatch(actions.undo(DrawTool.history.history[DrawTool.sides.selected.id]));
        this.forceUpdate();
    }

    redo() {
        const { dispatch } = this.props;
        dispatch(actions.redo(DrawTool.history.history[DrawTool.sides.selected.id]));
        this.forceUpdate();
    }

    render() {
        const { activeTool, dispatch, selected, history, colorSelected, sideSelected } = this.props;

        let view;

        if(sideSelected !== null && typeof sideSelected !== 'undefined'){
            this.substrateStyle = {backgroundImage: 'url(' + sideSelected.image_url + ')'}
        }

        if (this.state.mobile) {
            view = (
                <div className="toolbar with-scroll" onScroll={this.helpScrollArrows}>
                    <div
                        className={this.helpArrows.left ? 'user-help-scroll-arrow left show' : 'user-help-scroll-arrow left'}
                        onClick={this.helpClickArrows.bind(this, 'left')}>
                        <Icon icon={'left-arrow'}/>
                    </div>
                    <button className={'button substrate'} onClick={() => {dispatch(ProductActions.toggleLoadProductCategoryContainer(true))}}>
                        <span className={'substrateBg'} style={this.substrateStyle} />
                        <span className="label">{'アイテム'}</span>
                    </button>

                    <Button icon="paper" label={'表裏'} onClick={() => dispatch(actions.setActiveTool('sides'))}
                            active={activeTool === 'sides'}/>
                    <button
                        className={classNames('button', { active: activeTool === 'colors'})}
                        label={'カラー変更'}
                        onClick={() => dispatch(actions.setActiveTool('colors'))}
                    >
                        <span className="color"
                              style={{ backgroundColor: colorSelected && colorSelected.value || '#ffffff' }}/>
                        <span className="label">{'カラー変更'}</span>
                    </button>
                    <Button icon="hand" label={<span>アイテム<br />位置移動</span>} style={{ padding: '2px 0' }}
                            onClick={() => dispatch(actions.setActiveTool('panning'))}
                            active={activeTool === 'panning'}/>
                    <Button icon="cursor" label={'画像移動'} onClick={() => dispatch(actions.setActiveTool('pointer'))}
                            active={activeTool === 'pointer'}/>
                    <Button icon="brush" label={'筆'} onClick={() => dispatch(actions.setActiveTool('brush'))}
                            active={activeTool === 'brush'}/>
                    <Button icon="text" label={'テキスト'} onClick={() => dispatch(actions.setActiveTool('text'))}
                            active={activeTool === 'text'}/>
                    <Upload icon="image" label={'画像'} onUpload={files => this.fileUpload(files[0])}/>
                    <Button icon="sticker" label={'スタンプ'} onClick={() => dispatch(actions.setActiveTool('sticker'))}
                            active={activeTool === 'sticker'}/>
                    <Button icon="figures" label={'シェイプ'} onClick={() => dispatch(actions.setActiveTool('shapes'))}
                            active={activeTool === 'shapes'}/>
                    <Button icon="opacity" label={'カラー削除'}
                            onClick={() => dispatch(actions.setActiveTool('removeColor'))}
                            active={activeTool === 'removeColor'}/>
                    <Button icon="layers" label={'レイヤー'} onClick={() => dispatch(actions.setActiveTool('layers'))}
                            active={activeTool === 'layers'}/>
                    <div
                        className={this.helpArrows.right ? 'user-help-scroll-arrow right show' : 'user-help-scroll-arrow right'}
                        onClick={this.helpClickArrows.bind(this, 'right')}>
                        <Icon icon={'right-arrow'}/>
                    </div>
                </div>
            );
        } else {
            view = (
                <Scrollbars
                    style={{ width: 60 }}
                    autoHide
                    hideTracksWhenNotNeeded
                    autoHeight
                    autoHeightMax={this.state.height - 60}
                >
                    <div className="toolbar">
                        <Button icon="zoom-in" label={'拡大'} onClick={() => dispatch(actions.zoomIn())}/>
                        <Button icon="zoom-out" label={'縮小'} onClick={() => dispatch(actions.zoomOut())}/>
                        <Button icon="undo" label={'戻る'} disabled={activeTool === 'brush' || history.currentIndex === 0}
                                onClick={this.undo}/>
                        <Button icon="redo" label={'進む'}
                                disabled={activeTool === 'brush' || history.currentIndex + 1 === history.collection.length}
                                onClick={this.redo}/>
                        <Button icon="trash" label={'削除'} onClick={() => dispatch(actions.remove())}
                                disabled={!selected}/>
                        <div className="separator"/>
                        <Button icon="hand" label={<span>アイテム<br />位置移動</span>} style={{ padding: '2px 0' }}
                                onClick={() => dispatch(actions.setActiveTool('panning'))}
                                active={activeTool === 'panning'}/>
                        <Button icon="cursor" label={'画像移動'} onClick={() => dispatch(actions.setActiveTool('pointer'))}
                                active={activeTool === 'pointer'}/>
                        <Button icon="brush" label={'筆'} onClick={() => dispatch(actions.setActiveTool('brush'))}
                                active={activeTool === 'brush'}/>
                        <Button icon="text" label={'テキスト'} onClick={() => dispatch(actions.setActiveTool('text'))}
                                active={activeTool === 'text'}/>
                        <Upload icon="image" label={'画像'} onUpload={files => this.fileUpload(files[0])}/>
                        <Button icon="sticker" label={'スタンプ'} onClick={() => dispatch(actions.setActiveTool('sticker'))}
                                active={activeTool === 'sticker'}/>
                        <Button icon="figures" label={'シェイプ'} onClick={() => dispatch(actions.setActiveTool('shapes'))}
                                active={activeTool === 'shapes'}/>
                        <Button icon="opacity" label={'カラー透明化'}
                                onClick={() => dispatch(actions.setActiveTool('removeColor'))}
                                active={activeTool === 'removeColor'}/>
                        <Button icon="layers" label={'レイヤー'} onClick={() => dispatch(actions.setActiveTool('layers'))}
                                active={activeTool === 'layers'}/>
                        <Button icon="delete" ink={false} label={'全削除'} onClick={() => dispatch(actions.empty())}/>
                    </div>
                </Scrollbars>
            );
        }

        return view;
    }
}


function mapStateToProps(state) {
    return {
        activeTool: state.drawTool.activeTool,
        selected: state.drawTool.selected,
        history: state.drawTool.history,
        colorSelected: state.product.colorSelected,
        sideSelected: state.product.sideSelected,
    };
}

export default connect(
    mapStateToProps
)(Toolbar);

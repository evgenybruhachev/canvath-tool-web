import React, { Component } from 'react';
import classNames from 'classnames';
import Ink from 'react-ink';
import Icon from '../icon';

class ButtonShape extends Component  {

    static propTypes = {
        label: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element,
        ]),
        icon: React.PropTypes.string,
        image: React.PropTypes.string,
        onClick: React.PropTypes.func,
        active: React.PropTypes.bool,
        type: React.PropTypes.oneOf(['button', 'reset', 'submit']),
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        disabled: React.PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.getSvgFunc = this.getSvgFunc.bind(this);
        this.getSvgFunc(props.image);

        this.state = {
            svgElement: this.getSvgFunc(props.image)
        };
    }

    getSvgFunc( url ) {

        let req = null;

        try { req = new XMLHttpRequest(); } catch(e) {
            try { req = new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {
                try { req = new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {}
            }
        }

        if (req == null) throw new Error('XMLHttpRequest not supported');

        req.open("GET", url, false);

        req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
          setTimeout(() => $(this.refs['dhilt']).find('svg').css('fill', this.props.color))
        }
        };

        req.send(null);
        req = req.responseText;

        function createMarkup() {
            return {__html: req};
        }
        function MyComponent() {
            return <div dangerouslySetInnerHTML={createMarkup()} />;
        }
        return MyComponent();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.image !== this.props.image){
          setTimeout(() => this.setState({ svgElement: this.getSvgFunc(nextProps.image) }), 500);
        }
        if(nextProps.color !== this.props.color) {
            $(this.refs['dhilt']).find('svg').css('fill', nextProps.color)
        }
    }

    render() {
        return (
            <button ref='dhilt'
                className={classNames('button', 'button-shapes',  this.props.className)}
                label={this.props.label}
                onClick={this.props.onClick}
                type={this.props.type}
                style={this.props.style}
            >
                {this.state.svgElement}
                {this.props.icon && <Icon icon={this.props.icon} />}
                {this.props.label && <span className="label">{this.props.label}</span>}
                {this.props.ink && <Ink hasTouch={false} />}
            </button>
        );
    }
}

export default ButtonShape;

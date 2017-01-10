/**
 * Created by Ievgenii Sen on 29.12.16.
 */

window.colorPicker = (function () {
    var vm = this;
    var colorPickerPlace = document.getElementById('color-picker-place');
    var colorPickerCursor = document.getElementById('color-picker-cursor');
    var sliderElements = document.getElementsByClassName('color-picker-slider');
    var sliderOpacity = document.getElementById('slider-opacity');
    var sliderBrightness = document.getElementById('slider-brightness');
    var ctx = colorPickerPlace.getContext('2d');
    var bgColors = new Image();
    var r = 0;
    var g = 162;
    var b = 255;
    var opacity = 1;
    var brightness = 1;
    //Support touch
    var isTouchSupported = 'ontouchstart' in window;
    var startEvent = isTouchSupported ? 'touchstart' : 'mousedown';
    var moveEvent = isTouchSupported ? 'touchmove' : 'mousemove';
    var endEvent = isTouchSupported ? 'touchend' : 'mouseup';

    vm.getColorValue = getColorValue;

    main();

    return vm;

    function imgFilter() {
        ctx.drawImage(bgColors,
            -2, -2, colorPickerPlace.width + 3, colorPickerPlace.width + 3
        );

        var imageData = ctx.getImageData(0, 0, colorPickerPlace.width, colorPickerPlace.height),
            data = imageData.data;

        for (var i = 0; i < data.length; i += 4) {
            data[i] = data[i] * brightness;
            data[i + 1] = data[i + 1] * brightness;
            data[i + 2] = data[i + 2] * brightness;
            data[i + 3] = opacity * 255;
        }

        ctx.putImageData(imageData, 0, 0);

        setCursorColor();
    }

    function changeColorBySlider(element, position) {
        if (element == sliderOpacity)
            opacity = (position / (sliderOpacity.offsetWidth - 5)).toFixed(2);

        if (opacity < 0.01)
            opacity = 0.01;

        if (element == sliderBrightness)
            brightness = position / (sliderBrightness.offsetWidth - 5);

        imgFilter();
    }

    function getColorValue() {
        return {
            rgb: {
                r: r,
                g: g,
                b: b,
                a: opacity
            }
        }
    }

    function getCssValuePrefix() {
        var rtrnVal = '';
        var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

        var dom = document.createElement('div');

        for (var i = 0; i < prefixes.length; i++) {
            dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

            if (dom.style.background) {
                rtrnVal = prefixes[i];
            }
        }

        dom = null;
        delete dom;

        return rtrnVal;
    }

    function getPositionByEvent(event) {
        if (isTouchSupported) {
            var colorPickerPlacePosition = colorPickerPlace.getBoundingClientRect();

            if (event.targetTouches.length == 1)
                var touch = event.targetTouches[0];

            return {
                x: touch.pageX - touch.target.offsetLeft - colorPickerPlacePosition.left,
                y: touch.pageY - touch.target.offsetTop - colorPickerPlacePosition.top
            }
        } else {
            var x = event.layerX;
            var y = event.layerY;

            return {
                x: x,
                y: y
            }
        }
    }

    function getPositionByElement(element) {
        var box = element.getBoundingClientRect();

        return {
            y: box.top + pageYOffset,
            x: box.left + pageXOffset
        };
    }

    function getPositionByElementStyle(element) {
        var x = +element.style.left.substring(0, element.style.left.length - 2);
        var y = +element.style.top.substring(0, element.style.top.length - 2);

        return {
            x: x,
            y: y
        }
    }

    function main() {
        bgColors.src = 'assets/img/bgGradient.png';

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, colorPickerPlace.width, colorPickerPlace.width);

        bgColors.onload = function () {
            ctx.drawImage(bgColors,
                -2, -2, colorPickerPlace.width + 3, colorPickerPlace.width + 3
            );
        };

        colorPickerPlace.addEventListener(startEvent, startMove, false);

        chengeSlider();

        function startMove(event) {
            var coords = getPositionByEvent(event);
            moveAt(event, coords);

            colorPickerPlace.addEventListener(moveEvent, moving, false);
            colorPickerPlace.addEventListener(endEvent, endMove, false);
        }

        function moving(event) {
            var coords = getPositionByEvent(event);
            moveAt(event, coords);
        }

        function endMove() {
            colorPickerPlace.removeEventListener(moveEvent, moving);
        }
    }

    function moveAt(event, coords) {
        var radius = colorPickerPlace.width / 2;
        var radiusDistance = Math.sqrt(Math.pow((coords.x - radius), 2) + Math.pow((coords.y - radius), 2)); //Safari border-radius not working with events

        if (radiusDistance <= radius) {
            colorPickerCursor.style.left = coords.x - colorPickerCursor.offsetWidth / 2 + 'px';
            colorPickerCursor.style.top = coords.y - colorPickerCursor.offsetHeight / 2 + 'px';
            setCursorColor(event, true, coords);
        }
    }

    function setCursorColor(event, slideChange, coords) {
        if (!coords) {
            if (typeof event !== 'undefined') {
                var position = getPositionByEvent(event);
            } else {
                var position = getPositionByElementStyle(colorPickerCursor);
            }
        } else
            position = coords;

        if (position.x == 0 && position.y == 0) {
            position.x = 57;
            position.y = 176;
        }

        var pixelData = ctx.getImageData(position.x, position.y, 1, 1).data;
        var slideRgb = {
            r: Math.round(pixelData[0] / brightness),
            g: Math.round(pixelData[1] / brightness),
            b: Math.round(pixelData[2] / brightness)
        };

        r = pixelData[0];
        g = pixelData[1];
        b = pixelData[2];

        colorPickerCursor.style.top = position.y - colorPickerCursor.width / 2 + 'px';
        colorPickerCursor.style.left = position.x - colorPickerCursor.width / 2 + 'px';
        colorPickerCursor.style.opacity = 1;
        colorPickerCursor.style.backgroundColor = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';

        if (slideChange) {
            sliderOpacity.style.backgroundImage = getCssValuePrefix() + 'linear-gradient(left top, '
                + '#fff, rgb(' + slideRgb.r + ',' + slideRgb.g + ',' + slideRgb.b + '))';
            sliderBrightness.style.backgroundImage = getCssValuePrefix() + 'linear-gradient(left top, '
                + '#000, rgb(' + slideRgb.r + ',' + slideRgb.g + ',' + slideRgb.b + '))';
        }
    }

    function chengeSlider() {
        //Slide
        Array.prototype.forEach.call(sliderElements, function (element, i) {
            var thumbElem = element.children[0];

            thumbElem.addEventListener(startEvent, function (event) {
                var thumbCoords = getPositionByElement(thumbElem);
                var sliderCoords = getPositionByElement(element);

                if (isTouchSupported)
                    var shiftX = event.targetTouches[0].pageX - thumbCoords.x;
                else
                    var shiftX = event.pageX - thumbCoords.x;

                element.addEventListener(moveEvent, moving, false);
                element.addEventListener(endEvent, function () {
                    element.removeEventListener(moveEvent, moving);
                }, false);

                function moving(event) {
                    if (isTouchSupported)
                        var newLeft = event.targetTouches[0].pageX - shiftX - sliderCoords.x;
                    else
                        var newLeft = event.pageX - shiftX - sliderCoords.x;

                    var rightEdge = element.offsetWidth - thumbElem.offsetWidth;

                    if (newLeft < 0)
                        newLeft = 0;

                    if (newLeft > rightEdge)
                        newLeft = rightEdge;

                    changeColorBySlider(element, newLeft);

                    thumbElem.style.left = newLeft + 'px';
                }
            }, false);
        });
    }
});
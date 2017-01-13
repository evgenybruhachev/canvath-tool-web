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
    var rgba = {
        r: 0,
        g: 162,
        b: 255,
        a: 1
    };
    var cursorPosition = {
        x: 57,
        y: 176
    };
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
            data[i + 3] = rgba.a * 255;
        }

        ctx.putImageData(imageData, 0, 0);

        setCursorColor();
    }

    function changeColorBySlider(element, position) {
        if (element == sliderOpacity)
            rgba.a = (position / (sliderOpacity.offsetWidth - 5)).toFixed(2);

        if (rgba.a < 0.01)
            rgba.a = 0.01;

        if (element == sliderBrightness)
            brightness = position / (sliderBrightness.offsetWidth - 5);

        imgFilter();
    }

    function getColorValue() {
        return rgba;
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

            //Bug Y position in IOS
            return {
                x: event.touches[0].pageX - colorPickerPlacePosition.left,
                y: event.touches[0].pageY - colorPickerPlacePosition.top
            }
        } else {
            return {
                x: event.layerX,
                y: event.layerY
            };
        }
    }

    function getPositionByElement(element) {
        var box = element.getBoundingClientRect();

        return {
            y: box.top + pageYOffset,
            x: box.left + pageXOffset
        };
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
            event.preventDefault();

            var position = getPositionByEvent(event);
            moveAt(position);

            colorPickerPlace.addEventListener(moveEvent, moving, false);
            colorPickerPlace.addEventListener(endEvent, endMove, false);
        }

        function moving(event) {
            event.preventDefault();

            var position = getPositionByEvent(event);
            moveAt(position);
        }

        function endMove() {
            colorPickerPlace.removeEventListener(moveEvent, moving);
        }
    }

    function moveAt(position) {
        var radius = colorPickerPlace.width / 2;
        var radiusDistance = Math.sqrt(Math.pow((position.x - radius), 2) + Math.pow((position.y - radius), 2)); //Safari border-radius not working with events


        if (radiusDistance <= radius) {
            cursorPosition.x = position.x - colorPickerCursor.offsetWidth / 2;
            cursorPosition.y = position.y - colorPickerCursor.offsetHeight / 2;
            colorPickerCursor.style.left = cursorPosition.x + 'px';
            colorPickerCursor.style.top = cursorPosition.y + 'px';
            setCursorColor(true);
        }
    }

    function setCursorColor(slideChange) {
        var pixelData = ctx.getImageData(cursorPosition.x +  colorPickerCursor.offsetWidth / 2, cursorPosition.y +  colorPickerCursor.offsetHeight / 2, 1, 1).data;
        var slideRgb = {
            r: Math.round(pixelData[0] / brightness),
            g: Math.round(pixelData[1] / brightness),
            b: Math.round(pixelData[2] / brightness)
        };

        rgba.r = pixelData[0];
        rgba.g = pixelData[1];
        rgba.b = pixelData[2];

        colorPickerCursor.style.opacity = 1;
        colorPickerCursor.style.backgroundColor = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';

        if (slideChange) {
            sliderOpacity.style.backgroundImage = getCssValuePrefix() + 'linear-gradient(left top, '
                + '#fff, rgb(' + slideRgb.r + ',' + slideRgb.g + ',' + slideRgb.b + '))';
            sliderBrightness.style.backgroundImage = getCssValuePrefix() + 'linear-gradient(left top, '
                + '#000, rgb(' + slideRgb.r + ',' + slideRgb.g + ',' + slideRgb.b + '))';
        }
    }

    function chengeSlider() {
        Array.prototype.forEach.call(sliderElements, function (element, i) {
            var thumbElem = element.children[0];

            thumbElem.addEventListener(startEvent, function (event) {
                event.preventDefault();

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
                    event.preventDefault();

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

            element.addEventListener(startEvent, function (event) {
                event.preventDefault();

                var position = getPositionByEvent(event);

                if(position.x > element.offsetWidth - element.children[0].offsetWidth)
                    position.x = element.offsetWidth - element.children[0].offsetWidth;

                if(position.x < 5)
                    position.x = 0;

                changeColorBySlider(element, position.x);
                thumbElem.style.left = position.x + 'px';
            }, false);
        });
    }
});
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
    var r = null;
    var g = null;
    var b = null;
    var opacity = 1;
    var brightness = 1;

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

        if (element == sliderBrightness)
            brightness = position / (sliderBrightness.offsetWidth - 5);

        imgFilter();
    }

    function getColorValue () {
        return {
            rgb: {
                r: r,
                g: g,
                b: b,
                a: opacity
            }
        }
    }

    function getCoordsByElement(elem) {
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };

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
        var x = event.layerX;
        var y = event.layerY;

        //if (event.layerX != undefined && event.layerY != undefined) {
        //    x = event.layerX;
        //    y = event.layerY;
        //} else {
        //    x = event.layerX + document.body.scrollLeft +
        //        document.documentElement.scrollLeft + pageXOffset;
        //    y = event.clientY + document.body.scrollTop +
        //        document.documentElement.scrollTop + pageYOffset;
        //}
        //
        //x -= colorPickerPlace.offsetLeft;
        //y -= colorPickerPlace.offsetTop;

        return {
            x: x,
            y: y
        }
    }

    function getPositionByElement(element) {
        var x = +element.style.top.substring(0, element.style.top.length - 2);
        var y = +element.style.left.substring(0, element.style.left.length - 2);

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

        colorPickerPlace.addEventListener("mousedown", setCursorColor, false);

        colorPickerPlace.onmousedown = function (event) {
            moveAt(event);

            function moveAt(event) {
                var coords = getPositionByEvent(event);

                colorPickerCursor.style.left = coords.x - colorPickerCursor.offsetWidth / 2 + 'px';
                colorPickerCursor.style.top = coords.y - colorPickerCursor.offsetHeight / 2 + 'px';
            }

            colorPickerPlace.onmousemove = function (event) {
                moveAt(event);
                setCursorColor(event);
            };

            colorPickerPlace.onmouseup = function () {
                colorPickerPlace.onmousemove = null;
                document.onmouseup = null;
            };
        };

        colorPickerPlace.ondragstart = function () {
            return false;
        };

        //Slide
        Array.prototype.forEach.call(sliderElements, function (element, i) {
            var thumbElem = element.children[0];

            thumbElem.onmousedown = function (e) {
                var thumbCoords = getCoordsByElement(thumbElem);
                var shiftX = e.pageX - thumbCoords.left;

                var sliderCoords = getCoordsByElement(element);

                document.onmousemove = function (e) {
                    var newLeft = e.pageX - shiftX - sliderCoords.left;
                    var rightEdge = element.offsetWidth - thumbElem.offsetWidth;

                    if (newLeft < 0)
                        newLeft = 0;

                    if (newLeft > rightEdge)
                        newLeft = rightEdge;

                    changeColorBySlider(element, newLeft);

                    thumbElem.style.left = newLeft + 'px';
                };

                document.onmouseup = function () {
                    document.onmousemove = document.onmouseup = null;
                };

                return false;
            };

            thumbElem.ondragstart = function () {
                return false;
            };
        });
    }

    function setCursorColor(event) {
        if (typeof event !== 'undefined'){
            var position = getPositionByEvent(event);
        } else {
            var position = getPositionByElement(colorPickerCursor);
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

        sliderOpacity.style.backgroundImage = getCssValuePrefix() + 'linear-gradient(left top, '
            + '#fff, rgb(' + slideRgb.r + ',' + slideRgb.g + ',' + slideRgb.b + '))';
        sliderBrightness.style.backgroundImage = getCssValuePrefix() + 'linear-gradient(left top, '
            + '#000, rgb(' + slideRgb.r + ',' + slideRgb.g + ',' + slideRgb.b + '))';
    }

});
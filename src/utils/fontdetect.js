var FontDetect = function() {
  var _isInitialized = false;
  var _aFallbackFonts = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy'];
  var span = null;
	var eLang = 'en';
	var aChars = {
		'en': 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	};

  function _init () {
    if (_isInitialized) {	return; }

    _isInitialized = true;

    var body = document.body;
    var firstChild = document.body.firstChild;

    var div = document.createElement('div');
    div.id = 'fontdetectHelper';
    span = document.createElement('span');
    span.innerText = aChars[eLang];
    div.appendChild(span);

    body.insertBefore(div,firstChild);

    div.style.position   = 'absolute';
    div.style.visibility = 'hidden';
    div.style.top        = '-200px';
    div.style.left       = '-100000px';
    div.style.width      = '100000px';
    div.style.height     = '200px';
    div.style.fontSize   = '100px';
  }

  function _getCss (p_element, p_cssStyle) {
    if (p_element instanceof Element) {
      return window.getComputedStyle(p_element).getPropertyValue(p_cssStyle);
    }
    else if (window.jQuery) {
      return $(p_element).css(p_cssStyle);
    }
    else {
      return '';
    }
  }

  return {
    onFontLoaded: function (p_cssFontName, p_onLoad, p_onFail, p_options) {
      if (!p_cssFontName) {	return; }

      var msInterval = (p_options && p_options.msInterval) ? p_options.msInterval : 100;
      var msTimeout  = (p_options && p_options.msTimeout) ? p_options.msTimeout : 2000;
eLang = (p_options && p_options.eLang && p_options.eLang in aChars) ? p_options.eLang : 'en';

      if (!p_onLoad && !p_onFail) { return; }

      if (!_isInitialized) { _init (); }

      if (this.isFontLoaded(p_cssFontName)) {
        if (p_onLoad) {
          p_onLoad(p_cssFontName);
        }
        return;
      }

      var outerThis = this;
      var utStart = new Date().getTime();
      var idInterval = setInterval (function() {
        if (outerThis.isFontLoaded(p_cssFontName)) {
          clearInterval (idInterval);
          p_onLoad(p_cssFontName);
          return;
        }
        else {
          var utNow = new Date().getTime();
          if ((utNow - utStart) > msTimeout) {
            clearInterval (idInterval);
            if (p_onFail) {
              p_onFail(p_cssFontName);
            }
          }
        }
      },
        msInterval
      );
      },

      isFontLoaded: function (p_cssFontName) {
        var wThisFont = 0;
        var wPrevFont = 0;

        if (!_isInitialized) {
          _init ();
        }

        for(var ix = 0; ix < _aFallbackFonts.length; ++ix) {
          span.style.fontFamily = '"' + p_cssFontName + '",' + _aFallbackFonts[ix];
          wThisFont = span.offsetWidth;
          if (ix > 0 && wThisFont != wPrevFont) {
            return false;
          }
          wPrevFont = wThisFont;
        }
        return true;
      },

      whichFont: function (p_element) {
        var sStack = _getCss(p_element, 'font-family');
        var aStack = sStack.split(',');

        var sFont = aStack.shift();
        while (sFont) {
          sFont = sFont.replace(/^\s*['"]?\s*([^'"]*)\s*['"]?\s*$/, '$1');

          for (var ix=0; ix < _aFallbackFonts.length; ix++) {
            if (sFont == _aFallbackFonts[ix]) {
              return sFont;
            }
          }

          if (this.isFontLoaded(sFont)) {
            return sFont;
          }

          sFont = aStack.shift();
        }

        return null;
        }
    };
}();

export default FontDetect;

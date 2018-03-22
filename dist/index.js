"use strict";

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var path = require('path');

var assert = require('assert');

var child = require('./compiler');

var Oracle = require('./oracle');

var _require = require('./compat'),
    tap = _require.tap;

module.exports =
/*#__PURE__*/
function () {
  function WebappWebpackPlugin(args) {
    _classCallCheck(this, WebappWebpackPlugin);

    var options = typeof args === 'string' ? {
      logo: args
    } : args;
    assert(typeof options === 'object' && typeof options.logo === 'string', 'An input file is required');
    this.options = Object.assign({
      cache: '.wwp-cache',
      prefix: 'assets-[hash]/',
      favicons: {},
      inject: true
    }, options);
  }

  _createClass(WebappWebpackPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var _this = this;

      var oracle = new Oracle(compiler.context);

      if (this.options.cache) {
        this.options.cache = path.resolve(compiler.context, this.options.cache);
      }

      {
        var _options$favicons = this.options.favicons,
            _options$favicons$app = _options$favicons.appName,
            appName = _options$favicons$app === void 0 ? oracle.guessAppName() : _options$favicons$app,
            _options$favicons$app2 = _options$favicons.appDescription,
            appDescription = _options$favicons$app2 === void 0 ? oracle.guessDescription() : _options$favicons$app2,
            _options$favicons$ver = _options$favicons.version,
            version = _options$favicons$ver === void 0 ? oracle.guessVersion() : _options$favicons$ver,
            _options$favicons$dev = _options$favicons.developerName,
            developerName = _options$favicons$dev === void 0 ? oracle.guessDeveloperName() : _options$favicons$dev,
            _options$favicons$dev2 = _options$favicons.developerURL,
            developerURL = _options$favicons$dev2 === void 0 ? oracle.guessDeveloperURL() : _options$favicons$dev2,
            _options$favicons$url = _options$favicons.url,
            url = _options$favicons$url === void 0 ? '' : _options$favicons$url,
            _options$favicons$pat = _options$favicons.path,
            _path = _options$favicons$pat === void 0 ? '' : _options$favicons$pat;

        Object.assign(this.options.favicons, {
          appName,
          appDescription,
          version,
          developerName,
          developerURL,
          url,
          path: _path
        });
      }
      tap(compiler, 'make', 'WebappWebpackPlugin',
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(function* (compilation, callback) {
          try {
            // Generate favicons
            var result = yield child.run(_this.options, compiler.context, compilation);

            if (_this.options.inject) {
              // Hook into the html-webpack-plugin processing and add the html
              tap(compilation, 'html-webpack-plugin-before-html-processing', 'WebappWebpackPlugin', function (htmlPluginData, callback) {
                htmlPluginData.html = htmlPluginData.html.replace(/(<\/head>)/i, result + '$&');
                return callback(null, htmlPluginData);
              });
            }

            return callback();
          } catch (err) {
            return callback(err);
          }
        });

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }]);

  return WebappWebpackPlugin;
}();
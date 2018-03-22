"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var path = require('path');

var msgpack = require('msgpack-lite');

var SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

var _require = require('./compat'),
    getAssetPath = _require.getAssetPath;

module.exports.run = function (_ref, context, compilation) {
  var prefix = _ref.prefix,
      options = _ref.favicons,
      logo = _ref.logo,
      cacheDirectory = _ref.cache;
  // The entry file is just an empty helper
  var filename = '[hash]';
  var publicPath = compilation.outputOptions.publicPath; // Create an additional child compiler which takes the template
  // and turns it into an Node.JS html factory.
  // This allows us to use loaders during the compilation

  var compiler = compilation.createChildCompiler('webapp-webpack-plugin', {
    filename,
    publicPath
  });
  compiler.context = context;
  var loader = `!${require.resolve('./loader')}?${JSON.stringify({
    prefix,
    options
  })}`;
  var cache = cacheDirectory ? `!${require.resolve('cache-loader')}?${JSON.stringify({
    cacheDirectory
  })}` : '';
  new SingleEntryPlugin(context, `!${cache}${loader}!${logo}`, path.basename(logo)).apply(compiler); // Compile and return a promise

  return new Promise(function (resolve, reject) {
    compiler.runAsChild(function (err) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
          _ref3 = _slicedToArray(_ref2, 1),
          chunk = _ref3[0];

      var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          hash = _ref4.hash,
          _ref4$errors = _ref4.errors,
          errors = _ref4$errors === void 0 ? [] : _ref4$errors,
          _ref4$assets = _ref4.assets,
          assets = _ref4$assets === void 0 ? {} : _ref4$assets;

      if (err || errors.length) {
        return reject(err || errors[0].error);
      } // Replace [hash] placeholders in filename


      var output = getAssetPath(compilation, filename, {
        hash,
        chunk
      });
      var result = msgpack.decode(Buffer.from(eval(assets[output].source()), 'base64'));
      delete compilation.assets[output];

      var _loop = function _loop(name, contents) {
        compilation.assets[name] = {
          source: function source() {
            return contents;
          },
          size: function size() {
            return contents.length;
          }
        };
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = result.assets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref6 = _step.value;
          var name = _ref6.name;
          var contents = _ref6.contents;

          _loop(name, contents);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return resolve(result.html);
    });
  });
};
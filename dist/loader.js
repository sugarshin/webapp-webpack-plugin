"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var favicons = require('favicons');

var msgpack = require('msgpack-lite');

var _require = require('loader-utils'),
    parseQuery = _require.parseQuery,
    interpolateName = _require.interpolateName;

var _require2 = require('./compat'),
    getPublicPath = _require2.getPublicPath,
    getContext = _require2.getContext;

module.exports = function (content) {
  /* istanbul ignore next */
  if (!this.async) throw new Error('async is required');

  var _parseQuery = parseQuery(this.query),
      prefix = _parseQuery.prefix,
      options = _parseQuery.options;

  var callback = this.async();
  var context = getContext(this);
  var publicPath = getPublicPath(this._compilation);
  var path = prefix && interpolateName(this, prefix, {
    context,
    content
  }); // Generate icons

  favicons(content, options, function (err, result) {
    if (err) {
      return callback(new Error(err));
    }

    var refs = /(href=|content=|src=)(['"])([\w-]+[.](png|json|ico|xml))\2/g;
    var html = result.html.map(function (entry) {
      return entry.replace(refs, '$1$2' + publicPath + path + '$3$2');
    }).sort().join('');
    var images = result.images.map(function (_ref) {
      var name = _ref.name,
          contents = _ref.contents;
      return {
        name: path + name,
        contents
      };
    });
    var files = result.files.map(function (_ref2) {
      var name = _ref2.name,
          contents = _ref2.contents;
      return {
        name: path + name,
        contents: contents.replace(refs, '$1$2' + publicPath + path + '$3$2')
      };
    });

    var assets = _toConsumableArray(images).concat(_toConsumableArray(files));

    return callback(null, 'module.exports = ' + JSON.stringify(msgpack.encode({
      html,
      assets
    }).toString('base64')));
  });
};

module.exports.raw = true;
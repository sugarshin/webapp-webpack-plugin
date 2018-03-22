"use strict";

var camelCase = require('camelcase');
/* istanbul ignore next */


module.exports.getPublicPath = function (_ref) {
  var _ref$outputOptions$pu = _ref.outputOptions.publicPath,
      publicPath = _ref$outputOptions$pu === void 0 ? '' : _ref$outputOptions$pu;
  return publicPath.length && publicPath.substr(-1) !== '/' ? publicPath + '/' : publicPath;
};
/* istanbul ignore next */


module.exports.getAssetPath = function (_ref2, name, args) {
  var mainTemplate = _ref2.mainTemplate;
  return mainTemplate.getAssetPath
  /* Webpack >= 4.0 */
  ? mainTemplate.getAssetPath(name, args) : mainTemplate.applyPluginsWaterfall('asset-path', name, args);
};
/* istanbul ignore next */


module.exports.tap = function (tappable, hook, name, plugin) {
  return tappable.hooks
  /* Webpack >= 4.0 */
  ? tappable.hooks[camelCase(hook)] && tappable.hooks[camelCase(hook)].tapAsync(name, plugin) : tappable.plugin(hook, plugin);
};
/* istanbul ignore next */


module.exports.getContext = function (loader) {
  return loader.options && loader.options.context || loader.rootContext;
};
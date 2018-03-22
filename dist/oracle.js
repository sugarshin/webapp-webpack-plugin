"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var path = require('path');

var findRoot = require('find-root');

var parseAuthor = require('parse-author');

module.exports =
/*#__PURE__*/
function () {
  function Oracle(context) {
    _classCallCheck(this, Oracle);

    try {
      this.pkg = require(path.join(findRoot(context), 'package.json'));
    } catch (_) {
      this.pkg = {};
    }
  }
  /**
   * Tries to guess the name from package.json
   */


  _createClass(Oracle, [{
    key: "guessAppName",
    value: function guessAppName() {
      return this.pkg.name;
    }
    /**
     * Tries to guess the description from package.json
     */

  }, {
    key: "guessDescription",
    value: function guessDescription() {
      return this.pkg.description;
    }
    /**
     * Tries to guess the version from package.json
     */

  }, {
    key: "guessVersion",
    value: function guessVersion() {
      return this.pkg.version;
    }
    /**
     * Tries to guess the developer {name, email, url} from package.json
     */

  }, {
    key: "guessDeveloper",
    value: function guessDeveloper() {
      return typeof this.pkg.author === 'string' ? parseAuthor(this.pkg.author) : typeof this.pkg.author === 'object' && this.pkg.author ? {
        name: this.pkg.author.name,
        email: this.pkg.author.email,
        url: this.pkg.author.url
      } : {};
    }
    /**
     * Tries to guess the developer name from package.json
     */

  }, {
    key: "guessDeveloperName",
    value: function guessDeveloperName() {
      return this.guessDeveloper().name;
    }
    /**
     * Tries to guess the developer URL from package.json
     */

  }, {
    key: "guessDeveloperURL",
    value: function guessDeveloperURL() {
      return this.guessDeveloper().url;
    }
  }]);

  return Oracle;
}();
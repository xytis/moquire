/**
 * @module morgue
 */

var
util        = require('util'),
Module      = require('module');

var _mocks = {
    stack   : [{}],
    active  : {}
};

var _require = Module.prototype.require;
Module.prototype.require = function(path) {
    return _mocks.active[path] || _require.call(this, path);
}

var _build = function (hash, list) {
    for(scope in list) {
        for(item in list[scope]) {
            hash[item] = list[scope][item];
        }
    }
    return hash;
}

/**
 * Replacement function for require. It loads requested module
 * and replaces mocked dependencies anywhere in require tree.
 *
 * @param {string} path Module name or path
 * @param {hash} mocks Suplied mocks or nothing
 * @return {any*} Module exports object
 */
var morgue = function(path, mocks) {
    _mocks.stack.push(mocks || {});
    _mocks.active = {};
    _build(_mocks.active, _mocks.stack);
    var body = require(path);
    _mocks.stack.pop();
    return body;
}

module.exports = morgue;

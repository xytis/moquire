var
util        = require('util'),
Module      = require('module');

var morgue = function(path, mocks) {
    mocks = mocks || {};

    var _require = Module.prototype.require;
    Module.prototype.require = function(path) {
        return mocks[path] || _require.call(this, path);
    }

    body = require(path);

    Module.prototype.require = _require;
    return body;
}

module.exports = morgue;

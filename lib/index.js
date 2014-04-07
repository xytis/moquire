var
util        = require('util'),
Module      = require('module');

var moquire = {}

var _require = Module.prototype.require;
Module.prototype.require = function(path) {
    return moquire[path] || _require.call(this, path);
}

module.exports = moquire;

var
vm          = require('vm'),
fs          = require('fs'),
path        = require('path'),
Module      = require('module');

/**
 * Helper for unit testing:
 * - load module with mocked dependencies
 * - allow accessing private state of the module
 *
 * @param {string} filename Module name (or absolute filename)
 * @param {Object=} mocks Hash of mocked dependencies
 */
var moquire = function(filename, mocks) {
    //Resolves the name of the module file (looks for package.json if it has to)
    filename = Module._resolveFilename(filename);
    mocks = mocks || {};

    // this is necessary to allow relative path modules within loaded file
    // i.e. requiring ./some inside file /a/b.js needs to be resolved to /a/some
    var resolve = function(name) {
        if (name.charAt(0) !== '.') return name;
        return path.resolve(path.dirname(filename), name);
    };

    var exports = {};
    var context = {
        require: function(name) {
            return mocks[name] || require(resolve(name));
        },
        console: console,
        exports: exports,
        module: {
            exports: exports
        }
    };

    vm.runInNewContext(fs.readFileSync(filename), context);
    return context.module.exports;
};

module.exports = moquire;

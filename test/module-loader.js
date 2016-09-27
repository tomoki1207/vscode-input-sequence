var vm = require('vm');
var fs = require('fs');
var path = require('path');

exports.loadModule = function (filePath, mocks) {
  mocks = mocks || {};

  var resolveModule = function (module) {
    if (module.charAt(0) !== '.')
      return module;
    return path.resolve(path.dirname(filePath), module);
  };

  var exports = {};
  var context = {
    require: function (name) {
      return mocks[name] || require(resolveModule(name));
    },
    console: console,
    exports: exports,
    module: {
      exports: exports
    }
  };
  vm.runInNewContext(fs.readFileSync(filePath), context);
  return context;
};
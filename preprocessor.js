var ts = require('typescript');

module.exports = {
  process: function(src, path) {
    return ts.transpile(src, {
      target: ts.ScriptTarget.ES5, 
      module: ts.ModuleKind.CommonJS
    })
  }
};
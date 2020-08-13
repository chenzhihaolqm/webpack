void function(modules){
            function require(filename){
               const fn = modules[filename];
               const module = { exports: {} }
               fn(require, module, module.exports )
               return module.exports;
            }
            require('E:\front_end\code\webpack\chapter06\simple-webpack\src\index.js')
         }({'E:\front_end\code\webpack\chapter06\simple-webpack\src\index.js': function(require,module, exports){
                "use strict";

var _greeting = require("greeting.js");

console.log((0, _greeting.greeting)('Tom'));
            },'greeting.js': function(require,module, exports){
                "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greeting = greeting;
function greeting(name) {
  return 'hello ' + name;
}
            },})
var noop = function() {};

var __deferred = [];

function __popDeferred() {
  var popped = __deferred;
  __deferred = [];
  return popped;
}

function __runDeferred() {
  var curr;

  while ((curr = __popDeferred()).length) {
    for (var i = 0, l = curr.length; i < l; i++) {
      var fn = curr[i];

      try {
        fn.call();

      } catch(e) {
        if (e.stack) {
          print(e.stack);
        } else {
          print(e);
        }
      }

    }
  }
}

var setTimeout, setImmediate, setInterval;
setTimeout = setImmediate = setInterval = function(fn, wait) {
  if (typeof fn === 'function') {
    __deferred.push(fn);
  }
};

var clearTimeout = noop;
var clearInterval = noop;
var clearImmediate = noop;

var location = {
  href: 'about:empty',
  search: ''
};

var console = {
  log: print,
  error: print
};

var navigator = {
  userAgent: 'nashorn'
};

var window = {
  addEventListener: noop,
  removeEventListener: noop,
  location: location,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  console: console,
  navigator: navigator,
  Object: Object,
  String: String,
  Array: Array,
  Boolean: Boolean,
  Date: Date,
  Function: Function,
  Math: Math,
  Number: Number,
  RegExp: RegExp,
  TypeError: TypeError,
  parseInt: parseInt,
  parseFloat: parseFloat
};

var global = window;

var windowGlobals = [
  'jQuery',
  'Ember',
  'EmberENV',
  'DS',
  '$'
];

windowGlobals.forEach(function(global) {
  Object.defineProperty(this, global, {
    get: function() { return window[global]; },
    set: function(val) { window[global] = val; }
  });
}.bind(this));

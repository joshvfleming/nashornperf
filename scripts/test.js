load('scripts/env.js');
load('node_modules/simple-dom/dist/simple-dom.js');
load('dist/assets/vendor.js');
load('dist/assets/nashornperf.js');
load('scripts/shims.js');

__runDeferred();

App = require('nashornperf/app').default;

function createApp() {
  var app = null;

  Ember.run(function() {
    app = App.create({ autoboot: false });

    app.instanceInitializer({
      name: 'stub-renderer',
      initialize: function(app) {
        var doc = new SimpleDOM.Document();
        var domHelper = new Ember.View.DOMHelper(doc);

        app.registry.register('renderer:-dom', {
          create: function() {
            return new Ember.View._Renderer(domHelper);
          }
        });
      }
    });
  });

  return app;
}

var app = createApp();

function serialize(element) {
  var serializer = new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap);
  return serializer.serialize(element);
}

function cleanup(result) {

  // There's currently a memory leak in Ember where cached action helper
  // instances are never released. This manually cleans the cache after a
  // render. More detail here:
  //
  //   https://dl.dropboxusercontent.com/u/23503375/leak.pdf
  //
  // Note: we can't simply reset the object to {}, because it's aliased in other
  // places, and doing so would only wipe out this one reference to the object.
  var ActionHelper = Ember.__loader.require(
    'ember-routing-htmlbars/helpers/action').ActionHelper;

  for (var action in ActionHelper.registeredActions) {
    delete ActionHelper.registeredActions[action];
  }

  return result;
}

function render(instance) {
  var element;

  Ember.run(function() {
    element = instance.view.renderToElement();
  });

  return serialize(element);
}

function runOnce() {
  var html = '';

  app.visit('/')
    .then(render)
    .then(cleanup)
    .then(function(res) {
      html = res;
    });

  __runDeferred();

  return html;
}

function nTimes(fn, n) {
  var times = [];

  if (n <= 0) {
    return times;
  }

  for (var i = 0; i < n; i++) {
    var start = Date.now();
    fn();
    times.push(Date.now() - start);
  }

  return times;
}

var nTrials = 2000;

var times = nTimes(runOnce, nTrials);
writeFile('render-times-' + Date.now() + '.csv', times.join('\n'));

print(runOnce());

function readFile(path) {
  var Files = Java.type('java.nio.file.Files');
  var File = Java.type('java.io.File');
  var _String = Java.type('java.lang.String');
  try {
    return new _String(Files.readAllBytes(new File(path).toPath()), 'UTF-8');
  } catch (e) {
    print(e.stack);
  }
}

function writeFile(path, contents) {
  var PrintWriter = Java.type('java.io.PrintWriter');
  var writer = new PrintWriter(path, 'UTF-8');

  try {
    writer.println(contents);
  } catch(e) {
    print(e.stack);
  } finally {
    writer.close();
  }
}

// Shim for jquery "get" function, so that the data fetch will work.
define('jquery', [], function() {
  return { 'default': {
    get: function(url) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        var filepath = 'public' + '/' + url;

        try {
          var contents = readFile(filepath);
          var data = JSON.parse(contents);
          resolve(data);
        } catch(e) {
          console.log('Couldn\'t read file:', filepath);
          reject(e);
        }
      });
    }
  }};
});

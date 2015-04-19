var defineGetter = require('./jsdom/utils').defineGetter;
var defineSetter = require('./jsdom/utils').defineSetter;
var style = require('./jsdom/level2/style');
var dom = exports.dom = require('./jsdom/level3/index').dom;

exports.defaultLevel = dom.level3.html;
exports.browserAugmentation = require('./jsdom/browser/index').browserAugmentation;

exports.debugMode = false;

defineGetter(exports, 'version', function() {
  return 1.0;
});

exports.level = function (level, feature) {
  if(!feature) {
    feature = 'core';
  }

  return require('./jsdom/level' + level + '/' + feature).dom['level' + level][feature];
};

exports.jsdom = function (html, level, options) {

  options = options || {};
  if(typeof level == 'string') {
    level = exports.level(level, 'html');
  } else {
    level   = level || exports.defaultLevel;
  }

  var browser = exports.browserAugmentation(level, options),
      doc     = (browser.HTMLDocument)             ?
                 new browser.HTMLDocument(options) :
                 new browser.Document(options);

  require('./jsdom/selectors/index').applyQuerySelectorPrototype(level);

  if (typeof html === 'undefined' || html === null) {
    doc.write('<html><head></head><body></body></html>');
  } else {
    doc.write(html + '');
  }

  if (doc.close && !options.deferClose) {
    doc.close();
  }

  return doc;
};

exports.html = function(html, level, options) {
  html += '';

  // TODO: cache a regex and use it here instead
  //       or make the parser handle it
  var htmlLowered = html.toLowerCase();

  // body
  if (!~htmlLowered.indexOf('<body')) {
    html = '<body>' + html + '</body>';
  }

  // html
  if (!~htmlLowered.indexOf('<html')) {
    html = '<html>' + html + '</html>';
  }
  return exports.jsdom(html, level, options);
};

exports.env = function(html, level, callback) {
  if (arguments.length<3) {
    callback = level;
    level = null;
  }

  var doc = exports.html(html,level);
  callback(null, {document:doc});
}

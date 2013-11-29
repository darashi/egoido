var jade = require('jade');
var fs = require('fs');

var renderer = jade.compile(fs.readFileSync(__dirname + '/template.jade'));

module.exports.renderTweet = function(data) {
  var locals = {
    tweet: data
  };
  var html = renderer(locals);

  var message = {
    source: html,
    format: 'html'
  };
  return message;
}

var jade = require('jade');
var fs = require('fs');

var renderer = jade.compile(fs.readFileSync(__dirname + '/template.jade'));

module.exports.renderTweet = function(tweet) {
  var screen_name = tweet.user.screen_name;
  var locals = {
    tweet: tweet,
    url: {
      tweet: 'https://twitter.com/' + screen_name + '/status/' + tweet.id_str,
      user: 'https://twitter.com/' + screen_name
    }
  };
  var html = renderer(locals);

  var message = {
    source: html,
    format: 'html'
  };
  return message;
}

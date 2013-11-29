var ntwitter = require('ntwitter');
var request = require('request');
var _ = require('lodash');
var renderer = require('./renderer');

var env = process.env;
var parts = env.TWITTER_AUTH.split(':');
var config = {
  consumer_key: parts[0],
  consumer_secret: parts[1],
  access_token_key: parts[2],
  access_token_secret: parts[3]
};
twitter = new ntwitter(config);

function notify(url, message, callback) {
  request.post(
    url,
    {
      form: message
    },
    callback
  );
}

if (!env.TRACK) {
  throw 'Environment variable TRACK must be set';
}
console.log('TRACK: %s', env.TRACK);

var params = {
  track: env.TRACK
};

var hookConfigurations = [];
_(env).forEach(function(value, key) {
  if (!key.match(/^HOOK_/)) {
    return;
  }

  var matched = value.match(/^(.+?)(?:#(.+))?$/);
  if (!matched) {
    throw('Error in hook configuration ' + key);
  }

  var url = matched[1];
  var query = matched[2];

  hookConfigurations.push([url, query]);
});

console.log('Hook Configurations: %j', hookConfigurations);

twitter.stream('statuses/filter', params, function(stream) {
  stream.on('data', function(data) {

    if (data.retweeted_status) {
      console.log('Skip retweet');
      return;
    }
    var message = renderer.renderTweet(data);

    _(hookConfigurations).forEach(function(hook) {
      var hookUrl = hook[0];
      var query = hook[1];
      var matched = false;
      if (!query) {
        matched = true;
      } else {
        var regexp = new RegExp(query, 'i');
        matched = regexp.test(data.text);
      }
      if (matched) {
        notify(hookUrl, message);
      }
    });
  });

  stream.on('error', function(error, data) {
    throw error + ':' + data;
  });
});

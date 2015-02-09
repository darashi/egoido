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
var twitter = new ntwitter(config);

function notify(url, message, callback) {
  request.post(
    url,
    {
      form: message
    },
    callback
  );
}

var params = {};
if (!(env.TRACK || env.FOLLOW)) {
  throw 'At least one of environment variables TRACK or FOLLOW must be set';
}
if (env.TRACK) {
  params.track = env.TRACK;
}
if (env.FOLLOW) {
  params.follow = env.FOLLOW;
}
console.log('Params for statuses/filter: %j', params);


var hookConfigurations = [];
_(env).forEach(function(value, key) {
  if (!key.match(/^HOOK_/)) {
    return;
  }

  var matched = value.match(/^(.+?)(?:@([0-9,]+))?(?:#(.+))?$/);
  if (!matched) {
    throw('Error in hook configuration ' + key);
  }

  var user_ids = [];
  if (matched[2]) {
    user_ids = matched[2].split(/,/);
  }

  hookConfigurations.push({
    url: matched[1],
    user_ids: user_ids,
    query: matched[3]
  });
});

console.log('Hook Configurations: %j', hookConfigurations);

twitter.stream('statuses/filter', params, function(stream) {
  stream.on('data', function(data) {

    if (data.retweeted_status) {
      console.log('Skip retweet');
      return;
    }
    var message = renderer.renderTweet(data);
    console.log(message);

    _(hookConfigurations).forEach(function(hook) {
      var matched = false;
      if (!hook.query && hook.user_ids.length == 0) {
        matched = true;
      } else {
        if (hook.query && hook.query != "") {
          var regexp = new RegExp(hook.query, 'i');
          if (regexp.test(data.text)) {
            matched = true;
          }
        }
        if (hook.user_ids.indexOf(data.user.id_str) >= 0) {
          matched = true;
        }
      }
      if (matched) {
        notify(hook.url, message);
      }
    });
  });

  stream.on('error', function(error, data) {
    throw error + ':' + data;
  });
});

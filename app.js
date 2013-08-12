var ntwitter = require('ntwitter');
var request = require('request');
var _ = require('lodash');

var env = process.env;
var config = {
  consumer_key: env.TWITTER_CONSUMER_KEY,
  consumer_secret: env.TWITTER_CONSUMER_SECRET,
  access_token_key: env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: env.TWITTER_ACCESS_TOKEN_SECRET
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
_(env).select(function(value, key) {
  return key.match(/^HOOK_/);
}).map(function(value) {
  var components = value.split(/,/);
  var url = components[0];
  var query = components[1];

  hookConfigurations.push([url, query]);
});

console.log('Hook Configurations: %j', hookConfigurations);

twitter.stream('statuses/filter', params, function(stream) {
  stream.on('data', function(data) {
    var text = '';
    text += '@' + data.user.screen_name + ' (' + data.user.name + ') tweeted:\n';
    text += data.text + '\n';
    text += 'https://twitter.com/' + data.user.screen_name + '/status/' + data.id_str;
    console.log(text);

    var message = {
      body: text
    };

    _(hookConfigurations).forEach(function(query, hookUrl) {
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

  stream.on('error', function(error) {
    throw error;
  });
});

var jade = require('jade');
var fs = require('fs');
var twitter = require('twitter-text');
var moment = require('moment');

var renderer = jade.compile(fs.readFileSync(__dirname + '/template.jade'));

var autolink = function(tweet) {
  var entities = tweet.entities;
  var urlEntities = entities.urls;
  if (entities.media) {
    urlEntities = urlEntities.concat(entities.media);
  }
  var html = twitter.autoLink(tweet.text, {
    urlEntities: urlEntities
  });
  return html;
}

module.exports.renderTweet = function(tweet) {
  var screen_name = tweet.user.screen_name;
  var locals = {
    tweet: tweet,
    url: {
      tweet: 'https://twitter.com/' + screen_name + '/status/' + tweet.id_str,
      user: 'https://twitter.com/' + screen_name
    },
    html: autolink(tweet),
    time: moment(tweet.created_at)
  };
  var html = renderer(locals);

  var message = {
    source: html,
    format: 'html'
  };
  return message;
}

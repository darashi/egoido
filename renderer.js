module.exports.renderTweet = function(data) {
  var text = '';
  text += '@' + data.user.screen_name + ' (' + data.user.name + ') tweeted:\n';
  text += data.text + '\n';
  text += 'https://twitter.com/' + data.user.screen_name + '/status/' + data.id_str;
  console.log(text);

  var message = {
    source: text
  };
  return message;
}

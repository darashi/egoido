# Egoido

Ego-search tool for [idobata.io](https://idobata.io)

## Usage

Clone the repository:

    % git clone https://github.com/darashi/egoido.git

Create heroku app:

    % heroku create [your-app-name]

Configure credentials:

    % heroku config:add TWITTER_AUTH=[consumer_key]:[consumer_secret]:[access_token_key]:[access_token_secret]

Configure tracking terms (comma separated, passed to twitter):

    % heroku config:add TRACK=idobata,idobataio,idobata.io

Create generic hook on idobata.io and set it:

    % heroku config:add HOOK_[your-arbitrary-identifier]=https://idobata.io/hook/00000000-0000-0000-00000000000000000#[regexp to notify]

Tweets matched with `TRACK` parameter *and* `[regexp to notify]` will be sent to the hook.

You can have multiple hooks by using different hook identifier `[your-arbitary-identifier]` part. This is useful for tracking multiple terms and dispatch to different rooms.

You can omit `#[regexp to notify]`. If do so, every tweet matched with `TRACK` parameter will be sent to the room.


Push codes:

    % git push heroku master

Set worker to keep running:

    % heroku ps:scale worker=1

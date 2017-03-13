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

Configure following user id (comma separated, passed to twitter):

    % heroku config:add FOLLOW=0,0,0

Create generic hook on idobata.io and set it:

    % heroku config:add HOOK_[your-arbitrary-identifier]=https://idobata.io/hook/00000000-0000-0000-00000000000000000#[regexp to notify]

Tweets matched with `TRACK` parameter *and* `[regexp to notify]` will be sent to the hook.

Or

    % heroku config:add HOOK_[your-arbitrary-identifier]=https://idobata.io/hook/00000000-0000-0000-00000000000000000@[comma separated user ids to notify]

Tweets matched with `FOLLOW` parameter *and* from one of `[comma separated user ids to notify]` will be sent to the hook.

If you want to combine `TRACK` and `FOLLOW`, specify `@[comma separated user ids to notify]` first and then specify `#[regexp to notify]`:

    % heroku config:add HOOK_[your-arbitrary-identifier]=https://idobata.io/hook/00000000-0000-0000-00000000000000000@[comma separated user ids to notify]#[regexp to notify]

Tweets matched (`TRACK` OR `FOLLOW`) AND (`comma separated use ids` OR `regexp to notify`) will be notified.

You can have multiple hooks by using different hook identifier `[your-arbitrary-identifier]` part. This is useful for tracking multiple terms and dispatch to different rooms.

You can omit `#[regexp to notify]` and `@[comma separated user ids to notify]`. If do so, every tweet matched with `TRACK` parameter or `FOLLOW` parameter will be sent to the room.


Push codes:

    % git push heroku master

Set worker to keep running:

    % heroku ps:scale worker=1

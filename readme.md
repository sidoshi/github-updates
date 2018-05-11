# github-updates

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/sidoshi/github-updates/issues) [![HitCount](http://hits.dwyl.io/sidoshi/github-updates.svg)](http://hits.dwyl.io/sidoshi/github-updates)

> Telegram Bot for receiving Notification Updates from Github

[Example Bot](https://t.me/GithubUpdatesBot)

## Usage

First [create a Telegram Bot](https://core.telegram.org/bots#creating-a-new-bot) by talking to the [BotFather](https://t.me/BotFather) and get the `Bot Token`.

Then,

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/sidoshi/github-updates&env=ALLOWED_TELEGRAM_USERS&env=BOT_TOKEN)

or

```bash
$ now sidoshi/github-updates -e BOT_TOKEN=XXX -e ALLOWED_TELEGRAM_USERS=XXX
```

## Environment Variables

* **BOT_TOKEN** - Required, The token received from BotFather.
* **ALLOWED_TELEGRAM_USERS** - Optional, Comma-seperated list of telegram usernames to the bot should be limited. <br />Example:- `ALLOWED_TELEGRAM_USERS="foo,bar,baz"`.<br /> Ignore it if you want to keep the bot public.

## License

MIT © [Siddharth Doshi](https://sid.sh)

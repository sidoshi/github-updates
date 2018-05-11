const { Composer, Telegram, Extra } = require('micro-bot')
const ghValid = require('gh-valid').default
const GHNP = require('ghnp').default

const { helpMessage, tokenStatus, notificationMessage } = require('./messages')

const botToken = process.env.BOT_TOKEN

const app = new Composer()
const telegram = new Telegram(process.env.BOT_TOKEN)

const accessRestricted = process.env.ALLOWED_TELEGRAM_USERS !== undefined
const allowedUsers = accessRestricted
  ? process.env.ALLOWED_TELEGRAM_USERS.split(',')
  : []

const isRestricted = username =>
  accessRestricted && !allowedUsers.includes(username)

// in-memory subscriptions store
const subscriptions = {}

const unsubscribe = chatId => {
  subscriptions[chatId] && subscriptions[chatId].cancel()
  delete subscriptions[chatId]
}

const subscribe = (githubToken, chatId) => {
  const ghnp = GHNP(githubToken)

  const RXSubscription = ghnp
    .poll()
    .pipe(ghnp.parseNotifications())
    .subscribe({
      next: async notification => {
        try {
          await telegram.sendMessage(
            chatId,
            notificationMessage(notification),
            Extra.markdown()
          )
        } catch (err) {
          if (err.code === 403) {
            unsubscribe(chatId)
          }
        }
      },
      error: err =>
        telegram
          .sendMessage(chatId, `There was an error: \n${err}`, Extra.markdown())
          .catch(console.log),
    })

  return RXSubscription.unsubscribe
}

app.start(ctx =>
  ctx.reply(
    helpMessage(
      true,
      ctx.update.message.from.first_name,
      isRestricted(ctx.update.message.from.username)
    ),
    Extra.markdown()
  )
)
app.help(ctx =>
  ctx.reply(
    helpMessage(false, null, isRestricted(ctx.update.message.from.username)),
    Extra.markdown()
  )
)

app.command('subscribe', async ctx => {
  const restricted = isRestricted(ctx.update.message.from.username)

  if (restricted) {
    ctx.reply(helpMessage(false, null, restricted), Extra.markdown())
    return
  }

  const chatId = ctx.update.message.chat.id
  if (subscriptions[chatId]) {
    ctx.reply('Sorry, only one subscription per user!')
    return
  }

  const token = ctx.update.message.text.split(' ')[1]
  if (!token) {
    ctx.reply('Please provide a token in format /subscribe <token>')
    return
  }

  const tokenValidation = await ghValid(token, ['notifications', 'repo'])
  ctx.reply(tokenStatus(tokenValidation), Extra.markdown())

  if (tokenValidation.tokenValid && tokenValidation.scopesValid) {
    const cancel = subscribe(token, chatId)
    subscriptions[chatId] = { token, cancel }
  }
})

app.command('unsubscribe', ctx => {
  const chatId = ctx.update.message.chat.id
  const subscription = subscriptions[chatId]

  if (!subscription) {
    ctx.reply('You have not yet subscribed with any token.')
    return
  }
  unsubscribe(chatId)
  ctx.reply('Good Bye!')
})

app.command('token', async ctx => {
  const chatId = ctx.update.message.chat.id
  const subscription = subscriptions[chatId]
  if (!subscription) {
    ctx.reply('You have not yet subscribed with any token. Please /subscribe')
    return
  }
  const token = subscription.token
  ctx.reply(tokenStatus(await ghValid(token)), Extra.markdown())
})

app.on('message', ctx =>
  ctx.reply(
    helpMessage(false, null, isRestricted(ctx.update.message.from.username)),
    Extra.markdown()
  )
)

module.exports = app

const { repository: repo } = require('../package.json')

const t = s => s.trim()

const sanitize = s =>
  s
    .replace(/\[/g, '\\[')
    .replace(/_/g, '\\_')
    .replace(/\*/g, '\\*')

const greet = name => `Hello, ${name} 👋`

const apology = () =>
  t(`
Sorry, This bot has restricted access 🙇‍.  
Though, It is easy to start one of your own for free in a couple of minutes.
Please visit [this page](${repo}) to read about hosting your own version.
`)

const helpMessage = (shouldGreet, name, restricted) =>
  t(`
${shouldGreet ? greet(name) : ''}

I will make sure that you receive your GitHub notifications on time. 

Use this commands to interact with me:

/subscribe <token> - subscribe with a token
/unsubscribe - no more notifications
/token - status of my token

${restricted ? apology() : ''}
`)

const tokenStatus = ({ tokenValid, scopesValid, scopes }) =>
  t(`
Token Status: ${tokenValid && scopesValid ? '✅' : '❌'}

${
    tokenValid
      ? `The token you have provided is valid ${
          scopesValid
            ? 'and has all the right scopes.'
            : `, but it does not have the required scopes.
Please provide a token with _notifications_ and _repo_ scope`
        }`
      : 'The token you have provided is not a valid Github token.'
  }

${
    tokenValid
      ? `Your Github token has these scopes: _${scopes.join(', ')}_`
      : ''
  }
`)

const notificationMessage = ({ title, repo, htmlUrl, reason }) =>
  t(`
*${sanitize(repo)}*

${sanitize(title)}
${sanitize(htmlUrl)}

_${sanitize(reason)}_
`)

module.exports = {
  helpMessage,
  tokenStatus,
  notificationMessage,
}

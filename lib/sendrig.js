require('dotenv').config()
const helper = require('sendgrid').mail
const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY)

console.log('process.env.SENDGRID_API_KEY', process.env.SENDGRID_API_KEY)

module.exports = function (to, from, subject, callback) {
  let template = `I wish you really recieve this, cuz i had to code this thing for like to many time
    P.S. Chris, I hate you!`
  let fromEmail = new helper.Email(from.email, from.name)
  let toEmail = new helper.Email(to.email, to.name)
  let body = new helper.Content('text/plain', template)
  let mail = new helper.Mail(fromEmail, subject, toEmail, body)

  let req = sendgrid.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  })

  sendgrid.API(req, callback)
}

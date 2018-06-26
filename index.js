#!/usr/bin/env node

const program = require('commander')
const csv = require('csv')
const fs = require('fs')
const inquirer = require('inquirer')
const sendEmail = require('./lib/sendrig')
const async = require('async')
const chalk = require('chalk')

program
  .version('1.0.0')
  .option('-l, --list [list]', 'list of customers in CSV file')
  .parse(process.argv)

let options = [
  {
    type: 'input',
    name: 'sender.email',
    message: 'Sender\'s email address - '
  },
  {
    type: 'input',
    name: 'sender.name',
    message: 'Sender\'s name - '
  },
  {
    type: 'input',
    name: 'subject',
    message: 'Subject - '
  }
]
let contacts = []
let parse = csv.parse
let fileLocation = program.list || './assets/data.csv'
let stream = fs.createReadStream(fileLocation)
  .pipe(parse({ delimiter: ',' }))

stream
  .on('error', error => {
    return console.error(error.message)
  })
  .on('data', data => {
    let name = data[0] + ' ' + data[1]
    let email = data[2]

    contacts.push({name, email})
  })
  .on('end', () => {
    inquirer.prompt(options)
      .then(answer => {
        async.each(contacts, (contact, fn) => {
          sendEmail(contact, answer.sender, answer.subject, fn)
        }, (err) => {
          if (err) {
            return console.error(chalk.red(err))
          }
          console.log(chalk.green('Success'))
        })
      })
  })

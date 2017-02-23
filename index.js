#!/usr/bin/env node

const program = require('commander')
const ssh = require('./src/ssh.js')
const sync = require('./src/sync.js')
const logger = require('./src/logger.js')

program
  .version('0.0.1')
  .option('-s, --sync', 'action: sync')
  .option('-S, --ssh', 'action: ssh')
  .option('-n, --session-name [name]', 'session name')
  .on('--help', () => {
    console.log('   Examples')
    console.log('')
    console.log('     $ easy-sync -s -n dev')
  })
  .parse(process.argv)

if (process.argv.length === 2) program.help()
if (!program.sessionName) logger.error('session name is required')
if (program.ssh && !program.sync) ssh.login(program.sessionName)
if (program.sync && !program.ssh) sync.sync(program.sessionName)

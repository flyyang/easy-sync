#!/usr/bin/env node
const program = require('commander')
const ssh = require('./src/ssh.js')
const sync = require('./src/sync.js')
const list = require('./src/list.js')
const pjson = require('./package.json')

program
  .version(pjson.version)
  .option('-s, --sync', 'action: sync')
  .option('-S, --ssh', 'action: ssh')
  .option('-l, --list', 'list all session')
  .option('-i, --init', 'sync first time')
  .option('-n, --session-name [name]', 'session name')
  .on('--help', () => {
    console.log('   Examples')
    console.log('')
    console.log('     $ easy-sync -s -n dev')
  })
  .parse(process.argv)

if (process.argv.length === 2) program.help()
if (program.ssh && !program.sync) ssh.login(program.sessionName)
if (program.sync && !program.ssh) sync.sync(program.sessionName)
if (program.list) list.ls(program.sessionName)
if (program.init) sync.sync(program.sessionName, program.init)

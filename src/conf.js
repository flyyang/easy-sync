const parser = require('js-yaml')
const fs = require('fs')
const os = require('os')
const logger = require('./logger.js')
const confDefaultPath = `${os.homedir()}/.easy-sync.rc`

function confExists() {
  return fs.existsSync(confDefaultPath)
}

function parseConf() {
  if (!confExists()) {
    logger.error('.easy-syn.rc not found in user home path')
  }
  let conf = {}
  try {
    conf = parser.safeLoad(fs.readFileSync(confDefaultPath, 'utf8'))
  } catch (e) {
    logger.error('seems ~/.easy-sync.rc have syntax error');
  }
  return conf
}

function check(sessionName) {
  if (!(sessionName in raw)) logger.error('session not found in conf')
}

function getSession() {
  
}

const raw = parseConf()

module.exports = {
  raw,
  check,
  getSession,
}

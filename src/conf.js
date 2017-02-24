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
    logger.error('seems ~/.easy-sync.rc have syntax error')
  }
  return conf
}

function checkSessionExists(sessionName, raw) {
  if (!(sessionName in raw)) logger.error('session not found in conf')
  return true
}

function getSession(sessionName) {
  const raw = parseConf()
  let session = {}
  if (checkSessionExists(sessionName, raw)) {
    session = raw[sessionName]
  }
  return session
}

module.exports = {
  getSession,
  parseConf,
}

const conf = require('./conf.js')
const logger = require('./logger.js')

function ls(sessionName) {
  const raw = conf.parseConf()
  if (sessionName) {
    logger.success(JSON.stringify(raw[sessionName], null, 4))
  } else {
    logger.success(JSON.stringify(raw, null, 4))
  }
}

module.exports = {
  ls,
}
